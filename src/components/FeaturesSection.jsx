import Tooltip from "./Tooltip";
import { FEATURES } from "../data/features";

function FeatureTooltip({ name, meta, trigger, description, overcharge }) {
  return (
    <>
      <p className="rules-meta">
        {name} — {meta}
      </p>
      {trigger && (
        <p>
          <strong>Trigger:</strong> {trigger}
        </p>
      )}
      {description.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      {overcharge && (
        <>
          <p>
            <strong>Overcharge Options:</strong>
          </p>
          <ul className="overcharge-list">
            {overcharge.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default function FeaturesSection({ usedFeatures, onUseFeature }) {
  return (
    <div className="section">
      <h2>Features</h2>

      <div className="features-grid">
        {FEATURES.map(({ name, cost, meta, trigger, description, overcharge }) => (
          <div key={name} className="feature-row">
            <button onClick={() => onUseFeature(name, cost)}>
              {name} ({cost})
            </button>
            <span className="feature-meta">{meta}</span>
            <Tooltip
              content={
                <FeatureTooltip
                  name={name}
                  meta={meta}
                  trigger={trigger}
                  description={description}
                  overcharge={overcharge}
                />
              }
            >
              <span className="info-icon">ℹ</span>
            </Tooltip>
          </div>
        ))}
      </div>

      <h3>Used This Day:</h3>
      <ul>
        {usedFeatures.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
