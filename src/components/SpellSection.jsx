import { useState, useEffect } from "react";
import Tooltip from "./Tooltip";

const SPELL_LEVELS = [1, 2, 3];

const tooltipContent = (
  <>
    <p className="rules-meta">Spell Storing (once per dawn)</p>
    <p>
      At the end of a long or short rest, you can cast a spell and store it within the rings,
      expending a number of charges equal to the spell's level.
    </p>
    <p>The stored spell must be 3rd level or lower.</p>
    <p>
      Any ring bearer can cast the stored spell. Its range increases to 30 feet, and the target
      must be an ally bearing a ring.
    </p>
    <p>
      You use the spellcasting ability, save DC, and spell attack modifier of the creature who
      stored the spell.
    </p>
  </>
);

export default function SpellSection({
  storedSpell,
  spellLevel,
  spellStoredThisDawn,
  onSpellNameChange,
  onSpellLevelChange,
  onStoreSpellClick,
  onClearSpell,
}) {
  const [localSpellName, setLocalSpellName] = useState(storedSpell);
  const [localSpellLevel, setLocalSpellLevel] = useState(spellLevel);

  useEffect(() => {
    if (storedSpell) {
      setLocalSpellName("");
    }
  }, [storedSpell]);

  useEffect(() => {
    setLocalSpellLevel(spellLevel);
  }, [spellLevel]);

  return (
    <div className="section">
      <h2>
        Spell Storing (1x per Dawn){" "}
        <Tooltip content={tooltipContent}>
          <span className="info-icon">ℹ</span>
        </Tooltip>
      </h2>

      <input
        type="text"
        placeholder="Spell Name"
        value={localSpellName}
        onChange={(e) => {
          setLocalSpellName(e.target.value);
          onSpellNameChange(e.target.value);
        }}
      />

      <select
        value={localSpellLevel}
        onChange={(e) => {
          const newLevel = Number(e.target.value);
          setLocalSpellLevel(newLevel);
          onSpellLevelChange(e.target.value);
        }}
      >
        {SPELL_LEVELS.map((lvl) => (
          <option key={lvl} value={lvl}>
            Level {lvl}
          </option>
        ))}
      </select>

      <button disabled={spellStoredThisDawn} onClick={onStoreSpellClick}>
        Store Spell
      </button>

      <button onClick={onClearSpell}>Clear Stored Spell</button>

      <p>Stored: {storedSpell || "None"}</p>
    </div>
  );
}
