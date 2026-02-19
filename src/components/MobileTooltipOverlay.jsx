import { useEffect } from "react";
import { createPortal } from "react-dom";
import CloseButton from "./ui/CloseButton";
import "./ui/CloseButton.css";

export default function MobileTooltipOverlay({ title, content, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return createPortal(
    <div className="mobile-tooltip-overlay" onClick={onClose}>
      <div className="mobile-tooltip-content" onClick={(e) => e.stopPropagation()}>
        <div className="ui-header">
          <h3 className="ui-title">{title}</h3>
          <CloseButton onClick={onClose} />
        </div>
        <div className="mobile-tooltip-body">
          {content}
        </div>
      </div>
    </div>,
    document.body
  );
}
