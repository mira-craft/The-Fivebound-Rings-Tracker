import Tooltip from "./Tooltip";
import { FEATURES } from "../data/features";

function formatMeta(meta) {
  const parts = meta.split(/\b(bonus action|reaction|action)\b/i);
  const keywords = ["action", "bonus action", "reaction"];
  return parts.map((part, i) =>
    keywords.includes(part.toLowerCase())
      ? <span key={i} className="meta-keyword">{part}</span>
      : part
  );
}

function FeatureTooltip({ name, meta, description, overcharge }) {
  return (
    <>
      <p className="rules-meta">
        {name} — {formatMeta(meta)}
      </p>
      {description.map((paragraph, i) => (
        <p key={i}>
          {paragraph.map((segment, j) => (
            <span key={j} className={segment.bold ? "text-bold" : undefined}>
              {segment.text}
            </span>
          ))}
        </p>
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
      <div className="feature-meta">{formatMeta(meta)}</div>
      {children}
    </div>
  );
}

function SubFeature({ name, cost, meta, trigger, description, onUseFeature }) {
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
              trigger={trigger}
              description={description}
            />
          }
        >
          <span className="info-icon">ℹ</span>
        </Tooltip>
      </div>
      <div className="subfeature-meta">{formatMeta(meta)}</div>
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
