import { useState, useRef } from "react";

export default function Tooltip({ children, content }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  function handleEnter() {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      <div
        className={`tooltip-box${open ? " tooltip-box--visible" : ""}`}
        role="tooltip"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {content}
      </div>
    </span>
  );
}
