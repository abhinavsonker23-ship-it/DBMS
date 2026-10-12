const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    user: 'root',
    database: 'social_media_dbms',
    socketPath: '/home/hp/mysql_data/mysql.sock'
  });

  console.log('Connected to MariaDB successfully.');

  // 1. Process SocialMediaTop100.csv
  const csvPath = path.resolve(__dirname, '../SocialMediaTop100.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found at: ${csvPath}`);
    return;
  }
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(l => l.trim().length > 0);

  // Clear existing SocialMediaTop100 rows to ensure clean idempotency
  await connection.query('TRUNCATE TABLE SocialMediaTop100;');

  console.log(`Processing ${lines.length - 1} rows from CSV...`);
  let topRows = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    if (parts.length >= 5) {
      const rank = parseInt(parts[0].replace(/[^0-9]/g, ''), 10);
      let profile = parts[1].replace(/"/g, '').replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '').trim();
      const followers = parseInt(parts[2].replace(/[^0-9]/g, ''), 10) || 0;
      const postsCount = parseInt(parts[3].replace(/[^0-9]/g, ''), 10) || 0;
      let platform = parts[4].replace(/"/g, '').replace(/[^\x20-\x7E]/g, '').trim();

      if (rank && profile && platform) {
        topRows.push([rank, profile, followers, postsCount, platform]);
      }
    }
  }

  // Batch insert into SocialMediaTop100
  const insertSql = 'INSERT INTO SocialMediaTop100 (rank_num, profile_name, followers, posts_count, platform) VALUES ?';
  await connection.query(insertSql, [topRows]);
  console.log(`Inserted ${topRows.length} rows into SocialMediaTop100 table.`);

  // 2. Insert Top Influencers into Users table if not already present
  const notableCreators = [
    { username: 'cristiano_ronaldo', email: 'cristiano@top100.social', bio: 'Footballer & Athlete | 473M+ Followers | Global Top 100 on Instagram' },
    { username: 'leo_messi', email: 'messi@top100.social', bio: 'World Champion & Athlete | 355M+ Followers | Global Top 100 on Instagram' },
    { username: 'selena_gomez', email: 'selena@top100.social', bio: 'Artist, Founder @ Rare Beauty | 340M+ Followers | Global Top 100 on Instagram' },
    { username: 'mrbeast', email: 'mrbeast@top100.social', bio: 'Creator & Philanthropist | 100M+ Subscribers | Global Top 100 on YouTube' },
    { username: 'pewdiepie', email: 'pewdiepie@top100.social', bio: 'Content Creator & Gamer | 111M+ Subscribers | Global Top 100 on YouTube' },
    { username: 'elonmusk', email: 'elon@top100.social', bio: 'Engineering, Physics, AI & Space | 100M+ Followers | Global Top 100 on Twitter' }
  ];

  const defaultHash = '$2b$10$6f6yXSxfu1l6ravXYkqo2uRA1IHNdXuCKbmCiDHP.jsDoPAA97ngS'; // password123

  for (const creator of notableCreators) {
    await connection.query(`
      INSERT INTO Users (username, email, password_hash, bio)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE bio=VALUES(bio)
    `, [creator.username, creator.email, defaultHash, creator.bio]);
  }
  console.log('Seeded notable top creators into Users table.');

  // Fetch all user IDs to distribute posts among users
  const [users] = await connection.query('SELECT user_id FROM Users ORDER BY user_id ASC');
  const userIds = users.map(u => u.user_id);

  // 3. Process user_posts_dataset.json if exists
  const jsonPath = path.resolve(__dirname, 'user_posts_dataset.json');
  if (fs.existsSync(jsonPath)) {
    const postsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`Processing ${postsData.length} posts from dataset...`);

    for (let i = 0; i < postsData.length; i++) {
      const p = postsData[i];
      const assignedUserId = userIds[i % userIds.length];

      const [postResult] = await connection.query(`
        INSERT INTO Posts (user_id, content, like_count, language, tone)
        VALUES (?, ?, ?, ?, ?)
      `, [assignedUserId, p.text, p.engagement || 0, p.language || 'English', p.tone || 'General']);

      const newPostId = postResult.insertId;

      if (p.tags && Array.isArray(p.tags)) {
        for (const tag of p.tags) {
          const cleanTag = tag.trim().replace(/^#/, '');
          if (!cleanTag) continue;

          await connection.query('INSERT IGNORE INTO Tags (name) VALUES (?)', [cleanTag]);
          const [[tagRow]] = await connection.query('SELECT tag_id FROM Tags WHERE name = ?', [cleanTag]);

          if (tagRow) {
            await connection.query('INSERT IGNORE INTO PostTags (post_id, tag_id) VALUES (?, ?)', [newPostId, tagRow.tag_id]);
          }
        }
      }
    }
  }

  // Summary counts
  const [[{ count: topCount }]] = await connection.query('SELECT COUNT(*) as count FROM SocialMediaTop100');
  const [[{ count: userCount }]] = await connection.query('SELECT COUNT(*) as count FROM Users');
  const [[{ count: postCount }]] = await connection.query('SELECT COUNT(*) as count FROM Posts');
  const [[{ count: tagCount }]] = await connection.query('SELECT COUNT(*) as count FROM Tags');
  const [[{ count: postTagCount }]] = await connection.query('SELECT COUNT(*) as count FROM PostTags');

  console.log('--- Ingestion Summary ---');
  console.log(`SocialMediaTop100 rows: ${topCount}`);
  console.log(`Total Users in DB:     ${userCount}`);
  console.log(`Total Posts in DB:     ${postCount}`);
  console.log(`Total Tags in DB:      ${tagCount}`);
  console.log(`Total PostTags in DB:  ${postTagCount}`);

  await connection.end();
}

main().catch(err => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
