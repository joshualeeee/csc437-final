import type { Entry } from "../types/Entry";

interface EntryModalProps {
  entry: Entry;
  onClose: () => void;
}

const EntryModal = ({ entry, onClose }: EntryModalProps) => {
  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{entry.title}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-date">{formattedDate}</div>
        <div className="modal-body">
          <p>{entry.content}</p>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;
