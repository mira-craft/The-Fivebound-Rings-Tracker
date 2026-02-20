import Tooltip from "./Tooltip";

const CREATURE_TYPES = ["Devil", "Demon", "Fiend"];

const tooltipContent = (
  <p>
    At the end of a long or short rest, choose a creature type: devil, demon, or fiend
    (for creatures that are neither devils nor demons).
    As long as a ring bearer is within 30 feet of two other ring bearers, they gain a +1 bonus
    on saving throws forced by the chosen creature type.
  </p>
);

export default function CreatureSection({
  creatureType,
  canChooseCreature,
  onChooseCreature,
}) {
  return (
    <div className="section">
      <h2>
        Chosen Creature Type{" "}
        <Tooltip content={tooltipContent}>
          <span className="info-icon">ℹ</span>
        </Tooltip>
      </h2>

      <select
        value={creatureType}
        onChange={(e) => onChooseCreature(e.target.value)}
        disabled={!canChooseCreature}
      >
        <option value="">-- Select --</option>
        {CREATURE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <p>Current: {creatureType || "None selected"}</p>
    </div>
  );
}
