export default function SectionHeading({ children, className = "" }) {
  const classes = ["section-heading", className].filter(Boolean).join(" ");

  return <h1 className={classes}>{children}</h1>;
}
