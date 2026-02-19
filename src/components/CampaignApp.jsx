import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCampaignSync } from "../hooks/useCampaignSync";
import { useActionSystem } from "../hooks/useActionSystem";
import { MAX_CHARGES } from "../constants/ringState";
import ConfirmModal from "./ConfirmModal";
import RestSection from "./RestSection";
import CreatureSection from "./CreatureSection";
import ChargesSection from "./ChargesSection";
import FeaturesSection from "./FeaturesSection";
import SpellSection from "./SpellSection";
import RechargeSection from "./RechargeSection";
import ActivityPanel from "./ActivityPanel";
import DecorativeRing from "./ui/DecorativeRing";
import TelepathicBondModal from "./TelepathicBondModal";

export default function CampaignApp() {
  const { campaignId } = useParams();
  const { state, updateState, loading } = useCampaignSync(campaignId);
  const { modalConfig, setModalConfig, performAction, checkDuplicateAndApply, performUndo } =
    useActionSystem(state, updateState);

  const [teleModalOpen, setTeleModalOpen] = useState(false);
  const [teleOptions, setTeleOptions] = useState({ range: false, duration: false });

  const localSpellNameRef = useRef("");
  const localSpellLevelRef = useRef(1);

  useEffect(() => {
    localSpellNameRef.current = state.storedSpell;
    localSpellLevelRef.current = state.spellLevel;
  }, [state.storedSpell, state.spellLevel]);

  function handleLocalSpellNameChange(val) {
    localSpellNameRef.current = val;
  }

  function handleLocalSpellLevelChange(val) {
    localSpellLevelRef.current = Number(val);
  }

  function handleLongRest() {
    performAction(
      "longRest",
      "Long Rest",
      (prev) => ({
        ...prev,
        charges: Math.min(prev.charges + 3, MAX_CHARGES),
        usedFeatures: [],
        spellStoredThisDawn: false,
        rechargeUsedThisDawn: false,
        canChooseCreature: true,
      }),
      {
        message: (
          <span>
            Take a long rest? This lets you{' '}
            <span className="glow-highlight">regain up to 3 charges (max 10)</span>,{' '}
            <span className="glow-highlight">reset used features</span>,{' '}
            <span className="glow-highlight">clear the stored spell flag</span>,{' '}
            and <span className="glow-highlight">choose a new creature type</span>.
          </span>
        ),
      }
    );
  }

  function applyShortRest() {
    checkDuplicateAndApply("shortRest", "Short Rest", (prev) => ({
      ...prev,
      canChooseCreature: true,
      spellStoredThisDawn: false,
    }));
  }

  function handleShortRest() {
    setModalConfig({
      title: "Short Rest",
      message: <span>Take a short rest? This lets you choose a <span className="glow-highlight">new creature type</span> and store a <span className="glow-highlight">new spell</span>.</span>,
      onConfirm: () => {
        applyShortRest();
        setModalConfig(null);
      },
    });
  }

  function chooseCreature(type) {
    if (!state.canChooseCreature) return;
    performAction("chooseCreature", "Choose Creature", (prev) => ({
      ...prev,
      creatureType: type,
      canChooseCreature: false,
    }));
  }

  function useFeature(name, cost) {
    if (name === "Telepathic Bond") {
      setTeleOptions({ range: false, duration: false });
      setTeleModalOpen(true);
      return;
    }

    if (state.charges < cost) {
      alert("Not enough charges.");
      return;
    }

    performAction(`feature:${name}`, name, (prev) => ({
      ...prev,
      charges: prev.charges - cost,
      usedFeatures: [...prev.usedFeatures, name],
    }), { chargeCost: cost });
  }

  function storeSpell(spellName, spellLevel) {
    if (state.spellStoredThisDawn) {
      alert("Spell Storing already used this dawn.");
      return;
    }
    if (!spellName.trim()) {
      alert("Enter a spell name.");
      return;
    }
    if (state.charges < spellLevel) {
      alert("Not enough charges.");
      return;
    }
    performAction(
      "storeSpell",
      "Store Spell",
      (prev) => {
        localSpellNameRef.current = "";
        localSpellLevelRef.current = 1;
        return {
          ...prev,
          charges: prev.charges - spellLevel,
          spellStoredThisDawn: true,
          storedSpell: `${spellName} (Level ${spellLevel})`,
        };
      },
      { chargeCost: spellLevel }
    );
  }

  function clearStoredSpell() {
    performAction(
      "clearSpell",
      "Clear Stored Spell",
      (prev) => {
        localSpellNameRef.current = "";
        localSpellLevelRef.current = 1;
        return {
          ...prev,
          storedSpell: "",
          spellStoredThisDawn: false,
        };
      }
    );
  }

  function handleStoreSpellClick() {
    storeSpell(localSpellNameRef.current, localSpellLevelRef.current);
  }

  function rechargeWithSlot(level) {
    if (state.rechargeUsedThisDawn) {
      alert("Recharge already used this dawn.");
      return;
    }
    performAction(
      `recharge:${level}`,
      `Recharge (Level ${level})`,
      (prev) => {
        if (prev.rechargeUsedThisDawn) return prev;
        const gained = level * 2;
        return {
          ...prev,
          charges: Math.min(prev.charges + gained, MAX_CHARGES),
          rechargeUsedThisDawn: true,
        };
      },
      { chargeCost: 0 }
    );
  }

  function handleTeleConfirm(totalCost, featureName) {
    performAction("feature:Telepathic Bond", "Telepathic Bond", (prev) => ({
      ...prev,
      charges: prev.charges - totalCost,
      usedFeatures: [...prev.usedFeatures, featureName],
    }), { chargeCost: totalCost });
    setTeleModalOpen(false);
    setTeleOptions({ range: false, duration: false });
  }

  function handleTeleCancel() {
    setTeleModalOpen(false);
    setTeleOptions({ range: false, duration: false });
  }

  if (loading) {
    return <div className="container">Loading campaign...</div>;
  }

  return (
    <>
      <DecorativeRing />
      <ActivityPanel activityLog={state.activityLog ?? []} />
      <div className="container">
        <h1>The Fivebound Rings</h1>

        <div className="split-sections">
          <ChargesSection charges={state.charges} maxCharges={MAX_CHARGES} />
          <RestSection onLongRest={handleLongRest} onShortRest={handleShortRest} />
          <CreatureSection
            creatureType={state.creatureType}
            canChooseCreature={state.canChooseCreature}
            onChooseCreature={chooseCreature}
          />
        </div>

        <FeaturesSection
          usedFeatures={state.usedFeatures}
          onUseFeature={useFeature}
        />

        <SpellSection
          storedSpell={state.storedSpell}
          spellLevel={state.spellLevel}
          spellStoredThisDawn={state.spellStoredThisDawn}
          onSpellNameChange={handleLocalSpellNameChange}
          onSpellLevelChange={handleLocalSpellLevelChange}
          onStoreSpellClick={handleStoreSpellClick}
          onClearSpell={clearStoredSpell}
        />

        <RechargeSection
          rechargeUsedThisDawn={state.rechargeUsedThisDawn}
          onRechargeClick={rechargeWithSlot}
        />

        <ConfirmModal
          isOpen={!!modalConfig}
          title={modalConfig?.title}
          message={modalConfig?.message}
          onConfirm={modalConfig?.onConfirm}
          onCancel={() => setModalConfig(null)}
        />

        <button
          className="undo-fab"
          disabled={(state.history ?? []).length === 0}
          onClick={performUndo}
          aria-label="Undo Last Action"
        >
          ↩ Undo
        </button>

        {teleModalOpen && (
          <TelepathicBondModal
            teleOptions={teleOptions}
            setTeleOptions={setTeleOptions}
            charges={state.charges}
            onConfirm={handleTeleConfirm}
            onCancel={handleTeleCancel}
          />
        )}
      </div>
    </>
  );
}
