import express, { Request, Response, NextFunction } from "express";
import { MongoClient } from "mongodb";
import { CredentialsProvider } from "../CredentialsProvider";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        user?: IAuthTokenPayload // Let TS know what type req.user should be
    }
}

interface IAuthTokenPayload {
    username: string;
}

export function verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction // Call next() to run the next middleware or request handler
) {
    const authHeader = req.get("Authorization");
    // The header should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).end();
    } else { // JWT_SECRET should be read in index.ts and stored in app.locals
        jwt.verify(token, req.app.locals.JWT_SECRET as string, (error, decoded) => {
            if (decoded) {
                req.user = decoded as IAuthTokenPayload; // Modify the request for subsequent handlers
                next();
            } else {
                res.status(403).end();
            }
        });
    }
}

function generateAuthToken(username: string, jwtSecret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const payload: IAuthTokenPayload = {
            username
        };
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}

export function registerAuthRoutes(app: express.Application, mongoClient: MongoClient) {
    app.use(express.json());
    
    app.post("/auth/register", async (req: Request, res: Response) => {
        const c = new CredentialsProvider(mongoClient);
        let username: string = req.body.username;
        let password: string = req.body.password;
        
        if (!username || !password) {
            res.status(400).json({
                error: "Bad request",
                message: "Missing username or password"
            });
            return;
        } 

        try {
            const registrationResult = await c.registerUser(username, password);
            
            if (registrationResult === false) {
                res.status(409).json({
                    error: "Conflict",
                    message: "Username already exists"
                });
                return;
            }
            
            const token = await generateAuthToken(username, app.locals.JWT_SECRET as string);
            res.status(201).json({ token });
        } catch (error) {
            console.error(`Error during registration: ${error}`);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to create user account"
            });
        }
    });

    app.post("/auth/login", (req: Request, res: Response) => {
        const c = new CredentialsProvider(mongoClient);
        let username: string = req.body.username;
        let password: string = req.body.password;
        if (!username || !password) {
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });
            return;
        } 

        c.verifyPassword(username, password)
            .then((response) => {
                if (response === true) {
                    generateAuthToken(username, app.locals.JWT_SECRET as string)
                        .then((generatedToken) => res.send({ token: generatedToken }))
                        .catch((err) => console.error(err));
                } else {
                    res.status(401).send({
                        error: "Unauthorized",
                        message: "Wrong username or password"
                    });
                }
            }).catch((err) => {
                console.error(`error authorizing user: ${err}`);
            })
    });
}