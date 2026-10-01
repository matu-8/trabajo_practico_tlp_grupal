import type { Response } from "express";

export class HttpError extends Error {
    public readonly statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = "HttpError";
    }
}


export function sendError(res: Response, error: unknown): void {
    if (error instanceof HttpError) {
        res.status(error.statusCode).json({ok: false, msg: error.message});
        return;
    }
    console.error(error);
    res.status(500).json({ok: false, msg: "Error interno del servidor"});
}