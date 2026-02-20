import { useState } from "react";

const MAX_NAMES = 5;

export default function AttunedNames({ names = [], onAddName, onRemoveName }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  function validate(trimmed) {
    if (!trimmed) return "Enter a character name.";
    if (trimmed.length > 40) return "Name must be 40 characters or fewer.";
    if (names.length >= MAX_NAMES) return `Maximum of ${MAX_NAMES} bearers reached.`;
    if (names.some((n) => n.toLowerCase() === trimmed.toLowerCase()))
      return "That name is already attuned.";
    return null;
  }

  function handleAdd() {
    const trimmed = inputValue.trim();
    const validationError = validate(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }
    onAddName(trimmed);
    setInputValue("");
    setError("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAdd();
  }

  function handleInputChange(e) {
    setInputValue(e.target.value);
    if (error) setError("");
  }

  const isFull = names.length >= MAX_NAMES;

  return (
    <div className="attuned-names">
      <div className="attuned-names__header">
        <span className="attuned-names__label">Attuned Bearers</span>
        <span className="attuned-names__count">
          {names.length}&thinsp;/&thinsp;{MAX_NAMES}
        </span>
      </div>

      <div className="attuned-names__list">
        {names.length === 0 ? (
          <span className="attuned-names__empty">No bearers attuned</span>
        ) : (
          names.map((name) => (
            <div key={name} className="attuned-names__chip">
              <span className="attuned-names__chip-name">{name}</span>
              <button
                className="attuned-names__chip-remove"
                onClick={() => onRemoveName(name)}
                aria-label={`Remove ${name}`}
                title={`Remove ${name}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {!isFull && (
        <div className="attuned-names__input-row">
          <input
            type="text"
            className="attuned-names__input"
            placeholder="Character name…"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            maxLength={40}
            aria-label="Character name to attune"
          />
          <button
            className="attuned-names__add-btn secondary"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
          >
            + Attune
          </button>
        </div>
      )}

      {isFull && (
        <p className="attuned-names__full-notice">
          All five rings are bound. Remove a bearer to attune another.
        </p>
      )}

      {error && <p className="attuned-names__error">{error}</p>}
    </div>
  );
}
