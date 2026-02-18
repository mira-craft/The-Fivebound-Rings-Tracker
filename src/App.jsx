import { useState, useEffect, useRef } from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import ConfirmModal from "./components/ConfirmModal";
import RestSection from "./components/RestSection";
import CreatureSection from "./components/CreatureSection";
import ChargesSection from "./components/ChargesSection";
import FeaturesSection, { FEATURES } from "./components/FeaturesSection";
import SpellSection from "./components/SpellSection";
import RechargeSection from "./components/RechargeSection";
import ActivityPanel from "./components/ActivityPanel";
import { supabase } from "./lib/supabase";


const MAX_CHARGES = 10;

const initialState = {
  charges: 10,
  creatureType: "",
  usedFeatures: [],
  storedSpell: "",
  spellLevel: 1,
  spellStoredThisDawn: false,
  rechargeUsedThisDawn: false,
  canChooseCreature: true,
  lastActionUsage: {},
  history: [],
  activityLog: [],
};

export default function App() {
  return (
    <Routes>
      <Route path="/c/:campaignId" element={<CampaignApp />} />
      <Route path="*" element={<Navigate to="/c/hellgate" replace />} />
    </Routes>
  );
}

function CampaignApp() {
  const { campaignId } = useParams();

  const [state, setState] = useState(initialState);
  const [modalConfig, setModalConfig] = useState(null);
  const [teleModalOpen, setTeleModalOpen] = useState(false);
  const [teleOptions, setTeleOptions] = useState({ range: false, duration: false });

  const teleFeature = FEATURES.find((feature) => feature.name === "Telepathic Bond");
  const teleBaseCost = teleFeature?.cost ?? 1;
  const teleRangeCost = teleOptions.range ? 1 : 0;
  const teleDurationCost = teleOptions.duration ? 1 : 0;
  const teleTotalCost = teleBaseCost + teleRangeCost + teleDurationCost;
  const teleCanAfford = state.charges >= teleTotalCost;
  const [version, setVersion] = useState(1);
  const versionRef = useRef(1); // <--- ADD
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const localSpellNameRef = useRef("");
  const localSpellLevelRef = useRef(1);

  function updateState(updater) {
    setState((prev) => {
      const newState =
        typeof updater === "function" ? updater(prev) : updater;
      saveStateToDatabase(newState);
      return newState;
    });
  }

      useEffect(() => {                                  
        async function loadCampaign() {
          setLoading(true);

          const { data, error } = await supabase
            .from("campaigns")
            .select("*")
            .eq("id", campaignId)
            .single();

          if (error && error.code === "PGRST116") {
            // Campaign existiert nicht → neu erstellen
            const { data: insertData, error: insertError } = await supabase
              .from("campaigns")
              .insert([
                {
                  id: campaignId,
                  state: initialState,
                  version: 1,
                },
              ])
              .select()
              .single();

            if (!insertError) {
              setState(insertData.state);
              setVersion(insertData.version);
              versionRef.current = insertData.version; // <--- ADD
              setLastUpdated(insertData.updated_at);
            }
          } else if (!error && data) {
            setState(data.state);
            setVersion(data.version);
            versionRef.current = data.version; // <--- ADD
            setLastUpdated(data.updated_at);
          }

          setLoading(false);
        }

        loadCampaign();
      }, [campaignId]);                                   

      useEffect(() => {                                          
        const channel = supabase
          .channel("campaign-" + campaignId)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "campaigns",
              filter: `id=eq.${campaignId}`,
            },
            (payload) => {
              const newData = payload.new;
              setState(newData.state);
              setVersion(newData.version);
              versionRef.current = newData.version; // <--- ADD
              setLastUpdated(newData.updated_at);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }, [campaignId]);                                          

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

  function wasActionRecentlyUsed(actionKey, seconds = 300) {
    const lastUsed = state.lastActionUsage?.[actionKey];
    if (!lastUsed) return false;
    const diff = Date.now() - new Date(lastUsed).getTime();
    return diff < seconds * 1000;
  }

  function getLastUsedElapsed(actionKey) {
    const lastUsed = state.lastActionUsage?.[actionKey];
    if (!lastUsed) return null;
    const totalSeconds = Math.floor((Date.now() - new Date(lastUsed).getTime()) / 1000);
    if (totalSeconds < 60) {
      return `${totalSeconds} seconds ago`;
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s ago`;
  }

  function applyAction(actionKey, label, updater) {
    updateState((prev) => {
      const { history: prevHistory, version: _v, updated_at: _u, ...snapshot } = prev;
      const entry = {
        label,
        state: snapshot,
      };
      const newHistory = [...(prevHistory ?? []), entry].slice(-15);
      const intermediate = typeof updater === "function" ? updater(prev) : updater;
      const newActivityEntry = {
        id: crypto.randomUUID(),
        label,
        actionKey,
        timestamp: new Date().toISOString(),
      };
      return {
        ...intermediate,
        history: newHistory,
        lastActionUsage: {
          ...prev.lastActionUsage,
          [actionKey]: new Date().toISOString(),
        },
        activityLog: [
          newActivityEntry,
          ...(prev.activityLog ?? []),
        ].slice(0, 10),
      };
    });
  }

  function performAction(actionKey, label, updater, options = {}) {
    const { chargeCost, message: customMessage } = options;
    const message =
      customMessage ??
      (chargeCost != null
        ? `This will consume ${chargeCost} charge${chargeCost !== 1 ? "s" : ""}.`
        : "This action will modify the ring state.");
    setModalConfig({
      title: `Use ${label}?`,
      message,
      onConfirm: () => {
        setModalConfig(null);
        checkDuplicateAndApply(actionKey, label, updater);
      },
    });
  }

  function checkDuplicateAndApply(actionKey, label, updater) {
      if (wasActionRecentlyUsed(actionKey)) {
        const elapsed = getLastUsedElapsed(actionKey);
        setModalConfig({
          title: `${label} Recently Used`,
          message: `${label} was used ${elapsed}. Use again?`,
          onConfirm: () => {
            applyAction(actionKey, label, updater);
            setModalConfig(null);
          },
        });
        return;
      }
      applyAction(actionKey, label, updater);
  }

  function undoLastAction() {
    updateState((prev) => {
      const history = prev.history ?? [];
      if (history.length === 0) return prev;
      const entry = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      const newActivityEntry = {
        id: crypto.randomUUID(),
        label: "Undo Last Action",
        actionKey: "undo",
        timestamp: new Date().toISOString(),
      };
      return {
        ...entry.state,
        history: newHistory,
        activityLog: [
          newActivityEntry,
          ...(prev.activityLog ?? []),
        ].slice(0, 10),
      };
    });
  }

  function performUndo() {
    const history = state.history ?? [];
    if (history.length === 0) return;
    const lastLabel = history[history.length - 1]?.label;
    setModalConfig({
      title: lastLabel ? `Undo ${lastLabel}?` : "Undo Last Action?",
      message: lastLabel ? (
        <span>
          Revert the <span className="glow-highlight">{lastLabel} action</span> and restore the previous ring state.
        </span>
      ) : (
        "This will restore the previous ring state."
      ),
      onConfirm: () => {
        setModalConfig(null);
        undoLastAction();
      },
    });
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

  function handleRechargeClick(level) {
    rechargeWithSlot(level);
  }

  function formatTeleFeatureName() {
    const extras = [];
    if (teleOptions.range) extras.push("Extended Range");
    if (teleOptions.duration) extras.push("Extended Duration");
    if (!extras.length) return "Telepathic Bond";
    return `Telepathic Bond (${extras.join(" + ")})`;
  }

  function handleTeleConfirm() {
    if (!teleCanAfford) return;
    performAction("feature:Telepathic Bond", "Telepathic Bond", (prev) => ({
      ...prev,
      charges: prev.charges - teleTotalCost,
      usedFeatures: [...prev.usedFeatures, formatTeleFeatureName()],
    }), { chargeCost: teleTotalCost });
    setTeleModalOpen(false);
    setTeleOptions({ range: false, duration: false });
  }

  function handleTeleCancel() {
    setTeleModalOpen(false);
    setTeleOptions({ range: false, duration: false });
  }


  async function saveStateToDatabase(newState) {
  if (cooldown) return;

  setCooldown(true);

  const currentVersion = versionRef.current; 

  const { data, error } = await supabase
    .from("campaigns")
    .update({
      state: newState,
      version: currentVersion + 1,
    })
    .eq("id", campaignId)
    .eq("version", currentVersion)
    .select()
    .single();

  if (error) {
    // Optimistic lock failed → reload
    const { data: freshData } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (freshData) {
      setState(freshData.state);
      setVersion(freshData.version);
      versionRef.current = freshData.version; 
      setLastUpdated(freshData.updated_at);
    }
  } else if (data) {
    setVersion(data.version);
    versionRef.current = data.version;
    setLastUpdated(data.updated_at);
  }

  setTimeout(() => setCooldown(false), 800);
  }



  if (loading) {
    return <div className="container">Loading campaign...</div>;
  }

  return (
    <>
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
        onRechargeClick={handleRechargeClick}
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
                <span>{teleBaseCost}</span>
              </div>

              <div className={`cost-line ${teleOptions.range ? "" : "muted"}`}>
                <span>+ Extended Range:</span>
                <span>{teleRangeCost}</span>
              </div>

              <div className={`cost-line ${teleOptions.duration ? "" : "muted"}`}>
                <span>+ Extended Duration:</span>
                <span>{teleDurationCost}</span>
              </div>

              <div className="cost-total">
                <span>Total:</span>
                <span>{teleTotalCost} charges</span>
              </div>
            </div>

            {!teleCanAfford && (
              <p className="modal-warning">
                Insufficient charges for this loadout.
              </p>
            )}

            <div className="modal-actions">
              <button disabled={!teleCanAfford} onClick={handleTeleConfirm}>
                Confirm
              </button>
              <button onClick={handleTeleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
