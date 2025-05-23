import { useState } from "react";
import type { FormEvent } from "react";
import Header from "./Header";

const Write = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log({ title, content });
  };

  return (
    <>
    <Header />
    <div className="content-container">
      <form className="journal-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>New Journal</h2>
          <div className="button-container">
            <button type="submit" className="main-btn">
              Save Entry
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
