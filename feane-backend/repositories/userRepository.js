/**
 * repositories/userRepository.js
 *
 * Repository Pattern — ชั้นนี้รับผิดชอบการเข้าถึงข้อมูลโดยตรงเท่านั้น
 * ไม่มี business logic, ไม่มี HTTP — อ่าน/เขียน file หรือ database เท่านั้น
 *
 * ถ้าวันหลังอยากเปลี่ยนจาก JSON ไป PostgreSQL
 * แก้แค่ไฟล์นี้ไฟล์เดียว — Service และ Controller ไม่ต้องแตะเลย
 */

const fs   = require('fs');
const path = require('path');

const USERS_PATH     = path.join(__dirname, '../data/users.json');
const AUTH_USER_PATH = path.join(__dirname, '../data/auth_user.json');

// ─── READ ────────────────────────────────────────────────────────────────────

/**
 * ดึง users ทั้งหมด (seed + registered) จาก JSON files
 * @returns {Array<Object>}
 */
const findAll = () => {
  const seed       = JSON.parse(fs.readFileSync(USERS_PATH,     'utf8'));
  const registered = JSON.parse(fs.readFileSync(AUTH_USER_PATH, 'utf8'));
  return [...seed, ...registered];
};

/**
 * ค้นหา user จาก username (ค้นทั้งสอง file)
 * @param {string} username
 * @returns {Object|null}
 */
const findByUsername = (username) => {
  return findAll().find(u => u.username === username) || null;
};

// ─── WRITE ───────────────────────────────────────────────────────────────────

/**
 * บันทึก user ใหม่ลงใน auth_user.json
 * @param {Object} userRecord - { username, password (hashed), first_name, date_of_registration }
 * @returns {Object} userRecord ที่เพิ่งบันทึก
 */
const save = (userRecord) => {
  const existing = JSON.parse(fs.readFileSync(AUTH_USER_PATH, 'utf8'));
  existing.push(userRecord);
  fs.writeFileSync(AUTH_USER_PATH, JSON.stringify(existing, null, 2));
  return userRecord;
};

module.exports = { findAll, findByUsername, save };