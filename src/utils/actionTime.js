export function wasActionRecentlyUsed(lastActionUsage, actionKey, seconds = 300) {
  const lastUsed = lastActionUsage?.[actionKey];
  if (!lastUsed) return false;
  const diff = Date.now() - new Date(lastUsed).getTime();
  return diff < seconds * 1000;
}

export function getLastUsedElapsed(lastActionUsage, actionKey) {
  const lastUsed = lastActionUsage?.[actionKey];
  if (!lastUsed) return null;
  const totalSeconds = Math.floor((Date.now() - new Date(lastUsed).getTime()) / 1000);
  if (totalSeconds < 60) {
    return `${totalSeconds} seconds ago`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s ago`;
}
