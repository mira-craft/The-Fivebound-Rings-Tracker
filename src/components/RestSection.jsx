import Tooltip from "./Tooltip";

const longRestTooltip = (
  <>
    <p>
      <strong>+ 3 Charges</strong>
    </p>
    <p>
      <strong>Store New Spell</strong>
    </p>
      <p>
      <strong>Choose New Creature type</strong>
    </p>
  </>
);

const shortRestTooltip = (
  <>
    <p>
      <strong>Store New Spell</strong>
    </p>
    <p>
      <strong>Choose New Creature type</strong>
    </p>
  </>
);

export default function RestSection({ onLongRest, onShortRest }) {
  return (
    <div className="section">
      <h2>Rest</h2>
      <div className="rest-actions">
        <div className="rest-action">
          <button onClick={onLongRest}>Long Rest</button>
          <Tooltip content={longRestTooltip}>
            <span className="info-icon">ℹ</span>
          </Tooltip>
        </div>
        <div className="rest-action">
          <button onClick={onShortRest}>Short Rest</button>
          <Tooltip content={shortRestTooltip}>
            <span className="info-icon">ℹ</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
