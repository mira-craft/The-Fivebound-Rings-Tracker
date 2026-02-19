import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Tooltip.css";
import MobileTooltipOverlay from "./MobileTooltipOverlay";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkDevice = () => {
      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isCoarsePointer || isSmallScreen);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);
  return isMobile;
}

export default function Tooltip({ children, content, title = "Details" }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, transform: "" });
  const triggerRef = useRef(null);
  const isMobile = useIsMobile();
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  useLayoutEffect(() => {
    if (!isMobile && visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const hHalf = window.innerWidth / 2;
      const vHalf = window.innerHeight / 2;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const translateX = centerX > hHalf ? "-100%" : "0%";
      const translateY = centerY > vHalf ? "-100%" : "0%";
      
      setCoords({
        top: centerY > vHalf ? rect.top - 10 : rect.bottom + 10,
        left: centerX > hHalf ? rect.left - 10 : rect.right + 10,
        transform: `translate(${translateX}, ${translateY})`,
      });
    }
  }, [visible, isMobile]);

  const handleDesktopEnter = () => !isMobile && setVisible(true);
  const handleDesktopLeave = () => !isMobile && setVisible(false);
  const handleMobileClick = () => isMobile && setOverlayOpen(true);

  return (
    <>
      <span
        className="tooltip-trigger"
        ref={triggerRef}
        onMouseEnter={handleDesktopEnter}
        onMouseLeave={handleDesktopLeave}
        onClick={handleMobileClick}
      >
        {children}
      </span>
      {!isMobile && visible && createPortal(
        <div
          className={`tooltip-portal ${visible ? "visible" : ""}`}
          style={{
            top: coords.top,
            left: coords.left,
            transform: coords.transform,
          }}
          role="tooltip"
        >
          {content}
        </div>,
        document.body
      )}
      {isMobile && isOverlayOpen && (
        <MobileTooltipOverlay title={title} content={content} onClose={() => setOverlayOpen(false)} />
      )}
    </>
  );
}
