import beholderWarning from "../assets/beholderwarning.png";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  isRecentlyUsed,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ position: "relative" }}>
        {isRecentlyUsed && (
          <img
            src={beholderWarning}
            alt="warning"
            className="modal-warning-icon"
          />
        )}
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
