export default function Logo({
  size = 28,
  variant = "mark",
  color = "#177A59",
  className = "",
  style = {},
  ...props
}) {
  const c0 =
    "M106 0L196 0L216 114L178 114L165 39L128 38L156 199L131 266L0 266ZM103 118L116 194L103 227L59 228Z";
  const c1 =
    "M281 0L412 0L306 266L205 266L185 152L223 152L236 228L274 228L248 81ZM311 38L353 40L301 166L288 91Z";

  if (variant === "mark") {
    const width = Math.round((size * 412) / 266);
    return (
      <svg
        width={width}
        height={size}
        viewBox="0 0 412 266"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          flexShrink: 0,
          transition: "transform 0.2s ease",
          ...style
        }}
        {...props}
      >
        <path fillRule="evenodd" clipRule="evenodd" d={c0} fill={color} />
        <path fillRule="evenodd" clipRule="evenodd" d={c1} fill={color} />
      </svg>
    );
  }

  if (variant === "white") {
    const width = Math.round((size * 412) / 266);
    return (
      <svg
        width={width}
        height={size}
        viewBox="0 0 412 266"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
        {...props}
      >
        <path fillRule="evenodd" clipRule="evenodd" d={c0} fill="#FFFFFF" />
        <path fillRule="evenodd" clipRule="evenodd" d={c1} fill="#FFFFFF" />
      </svg>
    );
  }

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
        ...style
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
