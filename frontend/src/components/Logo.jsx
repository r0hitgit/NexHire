export default function Logo({
  size = 36,
  variant = "badge", // "badge" | "mark" | "white"
  color = "#177A59",
  className = "",
  style = {},
  ...props
}) {
  const c0 =
    "M106 0L196 0L216 114L178 114L165 39L128 38L156 199L131 266L0 266ZM103 118L116 194L103 227L59 228Z";
  const c1 =
    "M281 0L412 0L306 266L205 266L185 152L223 152L236 228L274 228L248 81ZM311 38L353 40L301 166L288 91Z";

  // Bare Mark
  if (variant === "mark") {
    const width = size;
    const height = Math.round((size * 266) / 412);
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 412 266"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
        {...props}
      >
        <defs>
          <linearGradient id="logoMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#177A59" />
            <stop offset="100%" stopColor="#0C4E3A" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={c0}
          fill={color === "#177A59" ? "url(#logoMarkGrad)" : color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={c1}
          fill={color === "#177A59" ? "url(#logoMarkGrad)" : color}
        />
      </svg>
    );
  }

  // White mark for dark backgrounds
  if (variant === "white") {
    const width = size;
    const height = Math.round((size * 266) / 412);
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 412 266"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: "inline-block", verticalAlign: "middle", ...style }}
        {...props}
      >
        <path fillRule="evenodd" clipRule="evenodd" d={c0} fill="#FFFFFF" />
        <path fillRule="evenodd" clipRule="evenodd" d={c1} fill="#FFFFFF" />
      </svg>
    );
  }

  // Rounded badge container (default)
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.28)}px`,
        background: "linear-gradient(135deg, #177A59 0%, #0C4E3A 100%)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(23, 122, 89, 0.22)",
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <svg
        width={Math.round(size * 0.65)}
        height={Math.round((size * 0.65 * 266) / 412)}
        viewBox="0 0 412 266"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fillRule="evenodd" clipRule="evenodd" d={c0} fill="#FFFFFF" />
        <path fillRule="evenodd" clipRule="evenodd" d={c1} fill="#FFFFFF" />
      </svg>
    </div>
  );
}

