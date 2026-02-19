export default function ChargesSection({ charges, maxCharges }) {
  return (
    <div className="section">
      <h2>Charges</h2>
      <div className="charges-display">
        {charges} / {maxCharges}
      </div>
    </div>
  );
}
