const Input = ({ type, placeholder, value, onChange, icon, name }) => {
  return (
    <div className="input-container">
      <input
        type={type}
        name={name}  
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
      />
      {icon && <span className="input-icon">{icon}</span>}
    </div>
  );
};

export default Input;