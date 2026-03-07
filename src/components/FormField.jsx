export default function FormField({ field }) {
  if (field.type === "select") {
    return (
      <div className="form-field">
        <label htmlFor={field.id} className="form-label">
          {field.label}
        </label>
        <select id={field.id} className="form-control form-control--select" defaultValue={field.options[0]}>
          {field.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="form-field">
        <label htmlFor={field.id} className="form-label">
          {field.label}
        </label>
        <textarea
          id={field.id}
          rows={field.rows || 4}
          className="form-control form-control--textarea"
          placeholder={field.placeholder || ""}
        ></textarea>
      </div>
    );
  }

  return (
    <div className="form-field">
      <label htmlFor={field.id} className="form-label">
        {field.label}
      </label>
      <input
        type={field.type || "text"}
        id={field.id}
        className="form-control"
        placeholder={field.placeholder || ""}
      />
    </div>
  );
}
