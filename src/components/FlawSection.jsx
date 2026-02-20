export default function FlawSection() {
  return (
    <div className="section flaw-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <h2 style={{ margin: 0 }}>Enchanting Flaw</h2>
      </div>
      <div className="flaw-content">
        <p>
          <strong><em>Attraction.</em></strong> <em>While attuned, ranged weapon attacks made against you have advantage to hit you.</em>
        </p>
      </div>
    </div>
  );
}
