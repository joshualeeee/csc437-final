import express, { Request, Response, NextFunction } from "express";
import { JournalProvider } from "../journalProvider";

const MAX_JOURNAL_LENGTH = 3000;

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
    user?: {
        username: string;
    };
}

export function registerJournalRoutes(app: express.Application, journalProvider: JournalProvider) {
    // get all journal entries for the current user logged in
    app.get("/api/journals", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const username = req.user?.username;
            if (!username) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }

            const journals = await journalProvider.getAllJournalsFromAuthor(username);
            res.json(journals);
        } catch (error) {
            next(error);
        }
    });

    // update journal entry
    app.put("/api/journals/:journalId", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { journalId } = req.params;
            const { title, entry } = req.body;
            const username = req.user?.username;

            if (!username) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }

            if (!title || !entry) {
                res.status(400).json({ error: "Title and entry are required" });
                return;
            }

            if (entry.length > MAX_JOURNAL_LENGTH) {
                res.status(400).json({ 
                    error: `Entry exceeds maximum length of ${MAX_JOURNAL_LENGTH} characters` 
                });
                return;
            }

            const result = await journalProvider.updateJournalEntry(
                journalId,
                title,
                entry,
                username
            );

            if (result === 0) {
                res.status(404).json({ error: "Journal entry not found" });
                return;
            } else if (result === -1) {
                res.status(403).json({ error: "Not authorized to update this entry" });
                return;
            }
            
            res.json({ message: "Journal entry updated successfully" });
        } catch (error) {
            next(error);
        }
    });

    // create journal entry
    app.post("/api/journals", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { title, entry } = req.body;
            const username = req.user?.username;

            if (!username) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }

            if (!title || !entry) {
                res.status(400).json({ error: "Title and entry are required" });
                return;
            }

            if (entry.length > MAX_JOURNAL_LENGTH) {
                res.status(400).json({ 
                    error: `Entry exceeds maximum length of ${MAX_JOURNAL_LENGTH} characters` 
                });
                return;
            }

            await journalProvider.createJournal(title, entry, username);
            res.status(201).json({ message: "Journal entry created successfully" });
        } catch (error) {
            next(error);
        }
    });
}