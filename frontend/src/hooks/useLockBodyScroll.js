import { useEffect } from "react";

let activeLockCount = 0;
let originalBodyOverflow = "";
let originalHtmlOverflow = "";
let originalBodyTouchAction = "";

/**
 * Custom hook to lock body & html scrolling when a modal, drawer, or mobile menu is active.
 * Uses a ref-counted lock to handle nested or consecutive modals cleanly.
 *
 * @param {boolean} isLocked Whether scroll should currently be locked.
 */
export function useLockBodyScroll(isLocked = true) {
  useEffect(() => {
    if (typeof document === "undefined" || !isLocked) return;

    if (activeLockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalHtmlOverflow = document.documentElement.style.overflow;
      originalBodyTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }
    activeLockCount++;

    return () => {
      activeLockCount = Math.max(0, activeLockCount - 1);
      if (activeLockCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalBodyTouchAction;
      }
    };
  }, [isLocked]);
}

export default useLockBodyScroll;
