const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'doxify.db');
const db = new Database(dbPath);

// Инициализация таблиц
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    avatar TEXT DEFAULT '',
    banner TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS pastes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    author_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// Создаем админа если нет
const adminPassword = require('bcryptjs').hashSync('I*&ASFDiagsdo87oasd', 10);
db.prepare(`
  INSERT OR IGNORE INTO users (username, password, role) 
  VALUES ('небо', ?, 'admin')
`).run(adminPassword);

module.exports = db;