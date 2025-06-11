import express from "express";
import dotenv from "dotenv";
import path from "path";
import { ValidRoutes } from "./shared/validRoutes";
import { connectMongo } from "./createMongo";
import { registerAuthRoutes, verifyAuthToken } from "./routes/authRoutes";
import { registerJournalRoutes } from "./routes/journalRoutes";
import { JournalProvider } from "./journalProvider";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const mongoClient = connectMongo();
const journalProvider = new JournalProvider(mongoClient);

const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

// Safely read JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET from environment variables");
}

const app = express();
// Store JWT_SECRET in app.locals
app.locals.JWT_SECRET = JWT_SECRET;

app.use(express.json());
app.use(express.static(STATIC_DIR));

// Register routes
registerAuthRoutes(app, mongoClient);
app.use("/api/*", verifyAuthToken);
registerJournalRoutes(app, journalProvider);

app.get("/api/hello", (req, res) => {
    res.send("Hello, World");
});

// Handle all valid routes by serving index.html
Object.values(ValidRoutes).forEach(route => {
    app.get(route, (req, res) => {
        res.sendFile(path.resolve(STATIC_DIR, "index.html"));
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});