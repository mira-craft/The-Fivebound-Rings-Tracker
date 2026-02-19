export default function ActivityPanel({ activityLog }) {
  function formatTime(isoString) {
    const d = new Date(isoString);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  return (
    <div className="activity-panel">
      <div className="activity-panel__title">Recent Activity</div>
      {activityLog.length === 0 ? (
        <div className="activity-panel__empty">No activity yet.</div>
      ) : (
        <ul className="activity-panel__list">
          {activityLog.map((entry) => (
            <li
              key={entry.id}
              className={entry.undone ? "activity-panel__item undone" : "activity-panel__item"}
            >
              <span className="activity-panel__time">{formatTime(entry.timestamp)}</span>
              <span className="activity-panel__label">{entry.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
