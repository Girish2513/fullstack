"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUser = getUser;
const pool_1 = require("../db/pool");
async function createUser(email, name) {
    const result = await pool_1.pool.query(`INSERT INTO users(email,name)
    VALUES($1,$2)
    RETURNING *`, [email, name]);
    return result.rows[0];
}
async function getUser(id) {
    const result = await pool_1.pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    return result.rows[0];
}
