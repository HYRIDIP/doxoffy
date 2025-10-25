// Используем SQL.js вместо better-sqlite3
let db = null;
let SQL = null;

export async function initDatabase() {
  if (db) return db;
  
  // Динамический импорт для серверной части
  if (typeof window === 'undefined') {
    SQL = await import('sql.js');
    const initSqlJs = SQL.default;
    
    SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    
    // Создаем новую базу данных в памяти
    db = new SQL.Database();
    
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Создаем админа если нет
    const bcrypt = await import('bcryptjs');
    const adminPassword = bcrypt.hashSync('I*&ASFDiagsdo87oasd', 10);
    
    try {
      const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
      stmt.bind([ 'небо', adminPassword, 'admin' ]);
      stmt.step();
      stmt.free();
    } catch (e) {
      // Админ уже существует
    }
  }
  
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return db;
}
