import Image from 'next/image';
import styles from './Button.module.css';

const Button = ({ children, icon, variant = 'primary', ...props }) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]}`} 
      {...props}
    >
      {icon && (
        <Image
          src={icon}
          alt=""
          width={16}
          height={16}
          className={styles.icon}
        />
      )}
      {children}
    </button>
  );
};

export default Button; 