import "./CloseButton.css";

export default function CloseButton({ onClick }) {
  return (
    <button
      className="ui-close-button"
      onClick={onClick}
      aria-label="Close"
    >
      &times;
    </button>
  );
}
