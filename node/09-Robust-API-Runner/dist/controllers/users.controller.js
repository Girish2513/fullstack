"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUser = getUser;
exports.getGithubProfile = getGithubProfile;
const service = __importStar(require("../services/users.service"));
const external_service_1 = require("../services/external.service");
async function createUser(req, res, next) {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            res.status(400).json({ error: "email and name are required" });
            return;
        }
        const user = await service.createUser(email, name);
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code === "23505") {
            res.status(409).json({ error: "email already exists" });
            return;
        }
        next(err);
    }
}
async function getUser(req, res, next) {
    try {
        const user = await service.getUser(Number(req.params.id));
        if (!user) {
            res.status(404).json({ error: "user not found" });
            return;
        }
        res.json(user);
    }
    catch (err) {
        next(err);
    }
}
async function getGithubProfile(req, res, next) {
    try {
        const profile = await (0, external_service_1.getGithubUser)(req.params.username);
        res.json(profile);
    }
    catch (err) {
        if (err.status) {
            res.status(err.status).json({ error: err.message });
            return;
        }
        next(err);
    }
}
