import { FEATURES } from "../data/features";

const teleFeature = FEATURES.find((f) => f.name === "Telepathic Bond");

function formatFeatureName(options) {
  const extras = [];
  if (options.range) extras.push("Extended Range");
  if (options.duration) extras.push("Extended Duration");
  if (!extras.length) return "Telepathic Bond";
  return `Telepathic Bond (${extras.join(" + ")})`;
}

export default function TelepathicBondModal({
  teleOptions,
  setTeleOptions,
  charges,
  onConfirm,
  onCancel,
}) {
  const baseCost = teleFeature?.cost ?? 1;
  const rangeCost = teleOptions.range ? 1 : 0;
  const durationCost = teleOptions.duration ? 1 : 0;
  const totalCost = baseCost + rangeCost + durationCost;
  const canAfford = charges >= totalCost;

  function handleConfirm() {
    if (!canAfford) return;
    onConfirm(totalCost, formatFeatureName(teleOptions));
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal">
        <h3>Telepathic Bond</h3>
        {teleFeature?.description?.map((line, index) => (
          <p key={index}>{line}</p>
        ))}

        <div className="modal-options">
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={teleOptions.range}
              onChange={(e) =>
                setTeleOptions((prev) => ({
                  ...prev,
                  range: e.target.checked,
                }))
              }
            />
            Extended Range (+1 charge)
          </label>

          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={teleOptions.duration}
              onChange={(e) =>
                setTeleOptions((prev) => ({
                  ...prev,
                  duration: e.target.checked,
                }))
              }
            />
            Extended Duration (+1 charge)
          </label>
        </div>

        <div className="cost-breakdown">
          <div className="cost-line">
            <span>Base:</span>
            <span>{baseCost}</span>
          </div>

          <div className={`cost-line ${teleOptions.range ? "" : "muted"}`}>
            <span>+ Extended Range:</span>
            <span>{rangeCost}</span>
          </div>

          <div className={`cost-line ${teleOptions.duration ? "" : "muted"}`}>
            <span>+ Extended Duration:</span>
            <span>{durationCost}</span>
          </div>

          <div className="cost-total">
            <span>Total:</span>
            <span>{totalCost} charges</span>
          </div>
        </div>

        {!canAfford && (
          <p className="modal-warning">
            Insufficient charges for this loadout.
          </p>
        )}

        <div className="modal-actions">
          <button disabled={!canAfford} onClick={handleConfirm}>
            Confirm
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
