import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from '../styles/Login.module.css';
import bgImage from '../../public/assets/images/bg.png';
import logoImage from '../../public/assets/images/logo.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would typically:
      // 1. Send API request to backend to initiate password reset
      // 2. Backend sends email with reset token
      // 3. For now, we'll just redirect to simulate the flow
      
      // You can add your API call here
      // await sendResetLink(email);

      // Redirect to reset password page
      // In a real application, you'd include the token from your API
      router.push('/reset-password?token=dummyToken');
      
    } catch (error) {
      console.error('Error sending reset link:', error);
      // Handle error (show error message to user)
    }
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
        <h1 className={styles.title}>Forgot Password</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" width="70%">
            SEND RESET LINK
          </Button>
          <div className={styles.resendLink}>
            <p>Not received? <a href="#" onClick={(e) => {
              e.preventDefault();
              // Handle resend logic here
            }}>Resend</a></p>
          </div>
        </form>
      </div>
    </div>
  );
} 