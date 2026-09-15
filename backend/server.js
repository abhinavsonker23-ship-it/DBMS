const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Dummy authentication middleware for demonstration
// In a real application, you would use JWT or sessions.
// Here we expect the user ID to be passed in the headers for simplicity.
const authenticate = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Missing x-user-id header' });
    }
    req.user = { id: parseInt(userId, 10) };
    next();
};

// 0. GET /
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Social Media DBMS Backend API!',
        status: 'running',
        endpoints: ['/register', '/login', '/posts', '/feed', '/notifications']
    });
});

// 1. POST /register
app.post('/register', async (req, res) => {
    const { username, email, password, bio } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO Users (username, email, password_hash, bio) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, bio]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2. POST /login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });
        
        res.json({ message: 'Login successful', userId: user.user_id, token: 'dummy-token' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST /posts
app.post('/posts', authenticate, async (req, res) => {
    const { content, media_url } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Posts (user_id, content, media_url) VALUES (?, ?, ?)',
            [req.user.id, content, media_url]
        );
        res.status(201).json({ message: 'Post created', postId: result.insertId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. GET /feed
app.get('/feed', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM user_feed WHERE viewer_id = ? ORDER BY created_at DESC LIMIT 20',
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. POST /posts/:id/like
app.post('/posts/:id/like', authenticate, async (req, res) => {
    const postId = req.params.id;
    try {
        await pool.query(
            'INSERT INTO Likes (user_id, post_id) VALUES (?, ?)',
            [req.user.id, postId]
        );
        res.json({ message: 'Post liked' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Already liked' });
        }
        res.status(500).json({ error: err.message });
    }
});

// 6. DELETE /posts/:id/like
app.delete('/posts/:id/like', authenticate, async (req, res) => {
    const postId = req.params.id;
    try {
        await pool.query(
            'DELETE FROM Likes WHERE user_id = ? AND post_id = ?',
            [req.user.id, postId]
        );
        res.json({ message: 'Post unliked' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. POST /users/:id/follow
app.post('/users/:id/follow', authenticate, async (req, res) => {
    const followingId = req.params.id;
    try {
        await pool.query(
            'INSERT INTO Follows (follower_id, following_id) VALUES (?, ?)',
            [req.user.id, followingId]
        );
        res.json({ message: 'User followed' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Already following' });
        }
        res.status(500).json({ error: err.message });
    }
});

// 8. GET /notifications
app.get('/notifications', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM Notifications WHERE user_id = ? AND is_read = FALSE ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
