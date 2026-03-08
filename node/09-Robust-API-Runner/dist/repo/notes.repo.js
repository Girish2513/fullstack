"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNote = createNote;
exports.getNotesByUser = getNotesByUser;
exports.getNote = getNote;
const pool_1 = require("../db/pool");
async function createNote(userId, content) {
    const result = await pool_1.pool.query(`INSERT INTO notes(user_id, content) VALUES($1, $2) RETURNING *`, [userId, content]);
    return result.rows[0];
}
async function getNotesByUser(userId) {
    const result = await pool_1.pool.query(`SELECT * FROM notes WHERE user_id = $1 ORDER BY id`, [userId]);
    return result.rows;
}
async function getNote(id) {
    const result = await pool_1.pool.query(`SELECT * FROM notes WHERE id = $1`, [id]);
    return result.rows[0];
}
