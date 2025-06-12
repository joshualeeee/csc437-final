import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import Header from "./Header";
import type { IApiJournalData } from "csc437-monorepo-backend/src/common/IApiData";
import toast from "react-hot-toast";

interface WriteProps {
  journals: IApiJournalData[];
  refetchJournals: () => void;
  authToken: string;
}

const Write = (props: WriteProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isExistingEntry, setIsExistingEntry] = useState(false);

  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Find if there's an entry for today
    const existingEntry = props.journals.find(
      (journal) => journal.date === today
    );

    if (existingEntry) {
      setTitle(existingEntry.title);
      setContent(existingEntry.entry);
      setIsExistingEntry(true);
    } else {
      setTitle("");
      setContent("");
      setIsExistingEntry(false);
    }
  }, [props.journals]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/journals`, {
        method: "POST", // or "PUT" if you're updating
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.authToken}`, // include if protected
        },
        body: JSON.stringify({
          title,
          entry: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save journal");
      }

      setIsExistingEntry(true);
      if (props.refetchJournals) {
        props.refetchJournals();
      }
      toast.success("Journal entry saved successfully!");
      console.log("Journal saved:", data);
    } catch (err: any) {
      console.error("Error saving journal:", err.message);
      toast.error("Error saving journal");
    }
  };

  return (
    <>
      <Header />
      <div className="content-container">
        <form className="journal-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>{isExistingEntry ? "Edit Journal" : "New Journal"}</h2>
            <div className="button-container">
              <button type="submit" className="main-btn">
                {isExistingEntry ? "Update Entry" : "Save Entry"}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="entry-title">Title</label>
            <input
              type="text"
              id="entry-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="entry-content">Content</label>
            <textarea
              id="entry-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={15}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Write;
