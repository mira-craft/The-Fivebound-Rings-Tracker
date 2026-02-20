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

function FeatureRow({ name, cost, meta, trigger, description, overcharge, isSubFeature, onUseFeature }) {
  return (
    <div className={`feature-row ${isSubFeature ? 'sub-feature' : ''}`}>
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
  );
}

export default function FeaturesSection({ usedFeatures, onUseFeature }) {
  // Group features into logical subsections
  const teleFeatures = FEATURES.filter(f => f.name === "Telepathic Bond" || f.isSubFeature);
  const sharedFeatures = FEATURES.filter(f => f.name === "Shared Burden");

  return (
    <div className="section">
      <h2>Features</h2>

      <div className="features-grid">
        {/* Telepathic Bond Subsection */}
        <div className="feature-subsection">
          <div className="subsection-header">Telepathic Bond</div>
          {teleFeatures.map((f) => (
            <FeatureRow key={f.name} {...f} onUseFeature={onUseFeature} />
          ))}
        </div>

        {/* Shared Burden Subsection */}
        <div className="feature-subsection shared-burden-section">
          <div className="subsection-header">Shared Burden</div>
          {sharedFeatures.map((f) => (
            <FeatureRow key={f.name} {...f} onUseFeature={onUseFeature} />
          ))}
        </div>
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
