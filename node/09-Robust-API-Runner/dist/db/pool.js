"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.setPool = setPool;
exports.getPool = getPool;
const pg_1 = require("pg");
let _pool;
function setPool(p) {
    _pool = p;
}
function getPool() {
    if (!_pool) {
        _pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
    }
    return _pool;
}
exports.pool = new Proxy({}, {
    get(_target, prop) {
        const p = getPool();
        const value = p[prop];
        if (typeof value === "function") {
            return value.bind(p);
        }
        return value;
    },
});
