import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from '../styles/Login.module.css';
import bgImage from '../../public/assets/images/bg.png';
import logoImage from '../../public/assets/images/logo.png';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();

  const sendResetLink = async (isResend = false) => {
    try {
      const formData = new FormData();
      formData.append('email', email);

      const response = await axios.post(
        'https://alturahealth.webjerky.com/api/forgot-password',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
        }
      );

      console.log('Response:', response);

      if (response.status === 200) {
        alert(isResend ? 'Reset link resent successfully' : 'Password reset link sent successfully');
        if (!isResend) {
          setEmail('');
          router.push('/');
        }
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 422) {
          errorMessage = error.response.data.errors?.email?.[0] || 'Invalid email address';
        } else {
          errorMessage = error.response.data.message || 'Server error. Please try again later';
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    await sendResetLink(false);
    setLoading(false);
  };

  const handleResend = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setResending(true);
    await sendResetLink(true);
    setResending(false);
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
            disabled={loading || resending}
          />
          <Button type="submit" width="70%" disabled={loading || resending}>
            {loading ? 'SENDING...' : 'SEND RESET LINK'}
          </Button>
          <div className={styles.resendLink}>
            <p>
              Not received?{' '}
              <a 
                href="#" 
                onClick={handleResend}
                style={{ 
                  cursor: resending ? 'not-allowed' : 'pointer',
                  opacity: resending ? 0.7 : 1 
                }}
              >
                {resending ? 'Resending...' : 'Resend'}
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 