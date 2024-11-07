const Button = ({ children, onClick, type = "button", fullWidth, width }) => {
  const buttonStyle = {
    ...(width ? { width } : fullWidth ? { width: '100%' } : {}),
    margin: '0 auto',
    display: 'block'
  };
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`custom-button ${fullWidth ? 'full-width' : ''}`}
      style={buttonStyle}
    >
      {children}
    </button>
  );
};

export default Button; 