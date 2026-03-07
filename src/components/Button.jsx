import { Link } from "react-router-dom";

function ButtonInner({ label, variant }) {
  if (variant === "primary") {
    return (
      <>
        <span className="button__bg"></span>
        <span className="button__glow"></span>
        <span className="button__label">{label}</span>
      </>
    );
  }

  return <span className="button__label">{label}</span>;
}

function isInternalRoute(to) {
  return typeof to === "string" && to.startsWith("/") && !to.startsWith("//");
}

export default function Button({
  label,
  to,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  extraClass = "",
}) {
  const className = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? "button--full" : "",
    extraClass,
  ]
    .filter(Boolean)
    .join(" ");

  if (isInternalRoute(to)) {
    return (
      <Link to={to} className={className}>
        <ButtonInner label={label} variant={variant} />
      </Link>
    );
  }

  if (to) {
    return (
      <a href={to} className={className}>
        <ButtonInner label={label} variant={variant} />
      </a>
    );
  }

  return (
    <button type={type} className={className}>
      <ButtonInner label={label} variant={variant} />
    </button>
  );
}
