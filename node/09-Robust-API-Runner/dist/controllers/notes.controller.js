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
exports.createNote = createNote;
exports.getNotesByUser = getNotesByUser;
exports.getNote = getNote;
const service = __importStar(require("../services/notes.service"));
async function createNote(req, res, next) {
    try {
        const userId = Number(req.params.userId);
        const { content } = req.body;
        if (!content) {
            res.status(400).json({ error: "content is required" });
            return;
        }
        const note = await service.createNote(userId, content);
        res.status(201).json(note);
    }
    catch (err) {
        if (err.code === "23503" ||
            (err.message && err.message.includes("foreign key constraint"))) {
            res.status(404).json({ error: "user not found" });
            return;
        }
        next(err);
    }
}
async function getNotesByUser(req, res, next) {
    try {
        const notes = await service.getNotesByUser(Number(req.params.userId));
        res.json(notes);
    }
    catch (err) {
        next(err);
    }
}
async function getNote(req, res, next) {
    try {
        const note = await service.getNote(Number(req.params.id));
        if (!note) {
            res.status(404).json({ error: "note not found" });
            return;
        }
        res.json(note);
    }
    catch (err) {
        next(err);
    }
}
