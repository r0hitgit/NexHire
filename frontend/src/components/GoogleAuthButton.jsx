import { useState, useEffect, useRef } from "react";

export function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
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
      // In development or when client ID is not configured yet
      setShowConfigModal(true);
      return;
    }

    setLoading(true);
    // If GSI rendered button exists, trigger click or prompt
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
            padding: "0.75rem 1rem",
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
          <GoogleIcon size={19} />
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
              <GoogleIcon size={24} />
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

