import Tooltip from "./Tooltip";

const tooltipContent = (
  <>
    <p>
      At the end of a long or short rest, choose a creature type: devil, demon, or fiend
      (for creatures that are neither devils nor demons).
    </p>
    <p>
      <strong>10 Charges</strong> (3 recharged at dawn)
    </p>
    <p>
      <strong>Prerequisite:</strong> Two other ring bearers within 30 feet who are attuned to
      the rings.
    </p>
  </>
);

export default function RestSection({ onLongRest, onShortRest }) {
  return (
    <div className="section">
      <h2>
        Rest{" "}
        <Tooltip content={tooltipContent}>
          <span className="info-icon">ℹ</span>
        </Tooltip>
      </h2>
      <div className="rest-actions">
        <button onClick={onLongRest}>Long Rest</button>
        <button onClick={onShortRest}>
          Short Rest
        </button>
      </div>
    </div>
  );
}
