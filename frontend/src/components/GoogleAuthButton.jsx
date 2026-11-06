import { useState, useEffect, useRef } from "react";

export function GoogleIcon({ size = 18 }) {
  const outerSize = Math.max(26, Math.round(size * 1.5));
  return (
    <div
      style={{
        width: `${outerSize}px`,
        height: `${outerSize}px`,
        borderRadius: "50%",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        style={{ display: "block" }}
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
    </div>
  );
}

export default function GoogleAuthButton({
  onSuccess,
  onError,
  text = "Continue with Google",
  disabled = false,
  role = "CANDIDATE"
}) {
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [demoEmail, setDemoEmail] = useState("");
  const hiddenGsiRef = useRef(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            setLoading(false);
            if (response.credential) {
              onSuccess(response.credential);
            } else {
              onError?.("Google sign-in did not return a credential.");
            }
          }
        });

        if (hiddenGsiRef.current) {
          window.google.accounts.id.renderButton(hiddenGsiRef.current, {
            theme: "outline",
            size: "large",
            width: 380,
            text: "continue_with"
          });
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGsi();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [clientId, onSuccess, onError]);

  const handleClick = () => {
    if (disabled || loading) return;

    if (!clientId) {
      setShowConfigModal(true);
      return;
    }

    setLoading(true);
    if (hiddenGsiRef.current?.querySelector("div[role=button]")) {
      hiddenGsiRef.current.querySelector("div[role=button]").click();
      setTimeout(() => setLoading(false), 2000);
    } else if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
      onError?.("Google Identity Services script is still loading. Please try again.");
    }
  };

  const handleDemoSignIn = (e) => {
    e.preventDefault();
    const emailToUse = demoEmail.trim() || `google.user.${role.toLowerCase()}@gmail.com`;
    setShowConfigModal(false);
    onSuccess(`demo_google_token:${emailToUse}`);
  };

  return (
    <>
      <div style={{ width: "100%", position: "relative" }}>
        {/* Hidden GSI container for standard Google button rendering */}
        <div
          ref={hiddenGsiRef}
          style={{ position: "absolute", top: 0, left: 0, opacity: 0, pointerEvents: "none", zIndex: -1 }}
        />

        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || loading}
          style={{
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "0.68rem 1rem",
            backgroundColor: "#FFFFFF",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-main)",
            fontSize: "0.92rem",
            fontWeight: 600,
            cursor: disabled || loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
          }}
          onMouseEnter={(e) => {
            if (!disabled && !loading) {
              e.currentTarget.style.backgroundColor = "var(--bg-soft)";
              e.currentTarget.style.borderColor = "#CBD5E1";
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !loading) {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "var(--border-color)";
            }
          }}
        >
          <GoogleIcon size={20} />
          <span>{loading ? "Connecting to Google..." : text}</span>
        </button>
      </div>

      {/* Setup Guide & Quick Test Modal (Shown if VITE_GOOGLE_CLIENT_ID is not configured yet) */}
      {showConfigModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem"
          }}
          onClick={() => setShowConfigModal(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "var(--radius-lg)",
              maxWidth: "460px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              border: "1px solid var(--border-color)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
              <GoogleIcon size={22} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                Google Sign-In Setup
              </h3>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: "1rem" }}>
              Google Sign-In is integrated! To connect your live Google account, add your OAuth Client ID to your environment:
            </p>

            <div
              style={{
                background: "var(--bg-soft)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "0.75rem",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "var(--primary-dark)",
                marginBottom: "1.25rem",
                overflowX: "auto"
              }}
            >
              VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
            </div>

            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                Test Google Sign-In with Demo Email:
              </label>
              <form onSubmit={handleDemoSignIn} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="email"
                  placeholder={`google.user.${role.toLowerCase()}@gmail.com`}
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.6rem 0.85rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.88rem",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "0.6rem 1rem", fontSize: "0.88rem", whiteSpace: "nowrap" }}
                >
                  Sign In
                </button>
              </form>
            </div>

            <div style={{ textAlign: "right", marginTop: "1.25rem" }}>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="btn-secondary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
