import Tooltip from "./Tooltip";
import { FEATURES } from "../data/features";

function FeatureTooltip({ name, meta, description, overcharge }) {
  return (
    <>
      <p className="rules-meta">
        {name} — {meta}
      </p>
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

function PrimaryFeature({ name, cost, meta, description, overcharge, onUseFeature, children }) {
  return (
    <div className="feature-card">
      <div className="feature-card-header">
        <button className="feature-card-button" onClick={() => onUseFeature(name, cost)}>
          <span className="feature-name">{name}</span>
          <span className="feature-cost">{cost} {cost === 1 ? 'charge' : 'charges'}</span>
        </button>
        <div className="feature-info-icon" onClick={(e) => e.stopPropagation()}>
          <Tooltip
            content={
              <FeatureTooltip
                name={name}
                meta={meta}
                description={description}
                overcharge={overcharge}
              />
            }
          >
            <span className="info-icon">ℹ</span>
          </Tooltip>
        </div>
      </div>
      <div className="feature-meta">{meta}</div>
      {children}
    </div>
  );
}

function SubFeature({ name, cost, meta, description, onUseFeature }) {
  return (
    <div className="subfeature-item">
      <button className="subfeature-button" onClick={() => onUseFeature(name, cost)}>
        <span className="subfeature-name">{name}</span>
        <span className="subfeature-cost">{cost} {cost === 1 ? 'charge' : 'charges'}</span>
      </button>
      <div className="subfeature-info-icon" onClick={(e) => e.stopPropagation()}>
        <Tooltip
          content={
            <FeatureTooltip
              name={name}
              meta={meta}
              description={description}
            />
          }
        >
          <span className="info-icon">ℹ</span>
        </Tooltip>
      </div>
      <div className="subfeature-meta">{meta}</div>
    </div>
  );
}

export default function FeaturesSection({ onUseFeature }) {
  const telepathicBond = FEATURES.find(f => f.name === "Telepathic Bond");
  const overchargeFeatures = FEATURES.filter(f => f.isSubFeature);
  const sharedBurden = FEATURES.find(f => f.name === "Shared Burden");

  return (
    <div className="section">
      <h2>Features</h2>

      <div className="features-list">
        {/* Telepathic Bond with nested overcharge options */}
        <PrimaryFeature {...telepathicBond} onUseFeature={onUseFeature}>
          {overchargeFeatures.length > 0 && (
            <div className="subfeatures-group">
              {overchargeFeatures.map((f) => (
                <SubFeature key={f.name} {...f} onUseFeature={onUseFeature} />
              ))}
            </div>
          )}
        </PrimaryFeature>

        {/* Shared Burden */}
        {sharedBurden && (
          <PrimaryFeature {...sharedBurden} onUseFeature={onUseFeature} />
        )}
      </div>
    </div>
  );
}
