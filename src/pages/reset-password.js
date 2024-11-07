import { useState, useEffect } from 'react';
import Image from 'next/image';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from '../styles/Login.module.css';
import bgImage from '../../public/assets/images/bg.png';
import logoImage from '../../public/assets/images/logo.png';
import { useRouter } from 'next/router';
import successIcon from '../../public/assets/icons/success.png';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    // Redirect if no token is present
    if (!token) {
      router.push('/forgot-password');
    }
    
    // You can also validate the token here
    // validateToken(token);
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add your password reset logic here
    // After successful password reset:
    setShowModal(true);
  };

  return (
    <div className={styles.container}>
      <Image 
        src={bgImage}
        alt="background"
        className={styles.backgroundImage}
        width={1200} 
        height={1200}
        priority
      />
      <div className={styles.overlay} />
      <div className={styles.logoContainer}>
        <Image 
          src={logoImage} 
          alt="Pure Medspa" 
          width={120} 
          height={40}
          priority
          className={styles.logo}
        />
      </div>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Reset Password</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.passwordContainer}>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              )}
            </button>
          </div>

          <div className={styles.passwordContainer}>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Password Again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              )}
            </button>
          </div>

          <Button type="submit" width="70%">
            RESET PASSWORD
          </Button>
        </form>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <Image
              src={successIcon}
              alt="Success"
              width={64}
              height={64}
              className={styles.successIcon}
            />
            <h2>Password Changed!</h2>
            <p>Your password has been successfully changed</p>
            <Button 
              onClick={() => {
                setShowModal(false);
                router.push('/');
              }}
              width="50%"
            >
              Okay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 