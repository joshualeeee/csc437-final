import { MongoClient, Collection, ObjectId, Filter } from "mongodb";

// Journal schema for reference
// {
//   _id: ObjectId,
//   userId: ObjectId, // ref to users._id
//   date: ISODate("2025-06-09"), // store in UTC, one per day
//   title: String,
//   entry: String, // markdown or rich text
// }

interface IJournalDocument {
    _id?: ObjectId;
    authorId: ObjectId;  // Reference to user document
    title: string;
    entry: string;
    date: Date;  // Added date field
}

// {
//   _id: ObjectId,
//   username: String, // unique
//   password: String, // securely hashed (e.g. bcrypt)
//   createdAt: Date,
// }

interface IUserDocument {
    _id: ObjectId;
    username: string;
}

export class JournalProvider {
    private journalCollection: Collection<IJournalDocument>;
    private userCollection: Collection<IUserDocument>;

    constructor(private readonly mongoClient: MongoClient) {
        const journalCollectionName = process.env.JOURNAL_COLLECTION_NAME;
        const userCollectionName = process.env.USERS_COLLECTION_NAME;
        
        if (!journalCollectionName || !userCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }
        
        this.journalCollection = this.mongoClient.db().collection(journalCollectionName);
        this.userCollection = this.mongoClient.db().collection(userCollectionName);
    }

    async getAllJournalsFromAuthor(username: string): Promise<IJournalDocument[]> {
        const user = await this.userCollection.findOne({ username });
        if (!user) {
            throw new Error("User not found");
        }

        return this.journalCollection.find({ authorId: user._id }).toArray();
    }

    async createJournal(
        title: string,
        entry: string,
        username: string
    ): Promise<void> {
        try {
            const user = await this.userCollection.findOne({ username });
            if (!user) {
                throw new Error("User not found");
            }

            // Check if an entry already exists for today
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const existingEntry = await this.journalCollection.findOne({
                authorId: user._id,
                date: today
            });

            if (existingEntry) {
                // Update existing entry
                await this.journalCollection.updateOne(
                    { _id: existingEntry._id },
                    { 
                        $set: { 
                            title,
                            entry,
                        }
                    }
                );
            } else {
                // Create new entry
                await this.journalCollection.insertOne({
                    authorId: user._id,
                    title,
                    entry,
                    date: today
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async updateJournalEntry(
        journalId: string, 
        newTitle: string, 
        newEntry: string, 
        username: string
    ): Promise<number> {
        // First get the journal to check ownership
        const journal = await this.journalCollection.findOne({ _id: new ObjectId(journalId) });
        if (!journal) {
            return 0; // journal not found
        }

        // Get the author's username
        const author = await this.userCollection.findOne({ _id: journal.authorId });
        if (!author || author.username !== username) {
            return -1; // Not authorized
        }

        // If authorized, update the entry
        const filter: Filter<IJournalDocument> = { _id: new ObjectId(journalId) };
        const result = await this.journalCollection.updateOne(
            filter,
            { 
                $set: { 
                    title: newTitle,
                    entry: newEntry,
                }
            }
        );
        return result.matchedCount;
    }
}