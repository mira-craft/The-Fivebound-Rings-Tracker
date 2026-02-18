import Tooltip from "./Tooltip";

const RECHARGE_SLOTS = [
  { level: 1, gain: 2 },
  { level: 2, gain: 4 },
  { level: 3, gain: 6 },
];

const tooltipContent = (
  <>
    <p className="rules-meta">Recharge (once per dawn / action)</p>
    <p>
      You expend a spell slot. The rings regain a number of charges equal to twice the level of
      the expended slot. If the expended slot was a pact slot, the number of charges equals the
      slot's level.
    </p>
  </>
);

export default function RechargeSection({ rechargeUsedThisDawn, onRechargeClick }) {
  return (
    <div className="section">
      <h2>
        Recharge (1x per Dawn){" "}
        <Tooltip content={tooltipContent}>
          <span className="info-icon">ℹ</span>
        </Tooltip>
      </h2>

      {RECHARGE_SLOTS.map(({ level, gain }) => (
        <button
          key={level}
          disabled={rechargeUsedThisDawn}
          onClick={() => onRechargeClick(level)}
        >
          Use Level {level} Slot (+{gain})
        </button>
      ))}
    </div>
  );
}
