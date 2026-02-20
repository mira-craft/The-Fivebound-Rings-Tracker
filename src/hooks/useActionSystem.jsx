import { useState } from "react";
import { wasActionRecentlyUsed, getLastUsedElapsed } from "../utils/actionTime";

export function useActionSystem(state, updateState) {
  const [modalConfig, setModalConfig] = useState(null);

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
        ].slice(0, 15),
      };
    });
  }

  function performAction(actionKey, label, updater, options = {}) {
    // 1. If recently used, show the duplicate warning immediately (skips normal confirm)
    if (wasActionRecentlyUsed(state.lastActionUsage, actionKey)) {
      const elapsed = getLastUsedElapsed(state.lastActionUsage, actionKey);
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

    // 2. Otherwise show normal confirmation modal
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
        applyAction(actionKey, label, updater);
        setModalConfig(null);
      },
    });
  }

  function undoLastAction() {
    updateState((prev) => {
      const history = prev.history ?? [];
      if (history.length === 0) return prev;

      const entry = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      const activityLog = prev.activityLog ?? [];
      const index = activityLog.findIndex((logEntry) => !logEntry.undone);

      const newActivityLog = index !== -1
        ? activityLog.map((logEntry, i) =>
            i === index ? { ...logEntry, undone: true } : logEntry
          )
        : activityLog;

      return {
        ...entry.state,
        history: newHistory,
        activityLog: newActivityLog,
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

  return {
    modalConfig,
    setModalConfig,
    performAction,
    performUndo,
  };
}
