-- SOCIAL MEDIA DATABASE SCHEMA

CREATE TABLE Users (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(30)  UNIQUE NOT NULL,
    email          VARCHAR(255) UNIQUE NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    bio            TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Posts (
    post_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    content      VARCHAR(2200) NOT NULL,
    media_url    VARCHAR(500),
    like_count   INT DEFAULT 0,
    language     VARCHAR(50) DEFAULT 'English',
    tone         VARCHAR(50) DEFAULT 'General',
    is_deleted   BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Comments (
    comment_id   INT AUTO_INCREMENT PRIMARY KEY,
    post_id      INT NOT NULL,
    user_id      INT NOT NULL,
    content      VARCHAR(500) NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Likes (
    user_id      INT NOT NULL,
    post_id      INT NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE
);

CREATE TABLE Follows (
    follower_id   INT NOT NULL,
    following_id  INT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id)  REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    CHECK (follower_id <> following_id)
);

CREATE TABLE Notifications (
    notification_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    type             VARCHAR(20) NOT NULL,
    reference_id     INT NOT NULL,
    is_read          BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name   VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE PostTags (
    post_id INT NOT NULL,
    tag_id  INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

CREATE TABLE SocialMediaTop100 (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    rank_num     INT NOT NULL,
    profile_name VARCHAR(255) NOT NULL,
    followers    BIGINT NOT NULL,
    posts_count  INT NOT NULL,
    platform     VARCHAR(100) NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_platform (platform),
    INDEX idx_followers (followers DESC)
);
