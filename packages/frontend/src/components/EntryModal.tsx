import type { IApiJournalData } from "csc437-monorepo-backend/src/common/IApiData";

interface EntryModalProps {
  journal: IApiJournalData;
  onClose: () => void;
}

const EntryModal = ({ journal, onClose }: EntryModalProps) => {
  const formattedDate = new Date(journal.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{journal.title}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-date">{formattedDate}</div>
        <div className="modal-body">
          <p>{journal.entry}</p>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;
