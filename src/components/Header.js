import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';
import logoImage from '../../public/assets/images/logo.png';
import bellIcon from '../../public/assets/icons/bellIcon.png';
import { authService } from '../api/services/auth.service';

export default function Header({ userName, userType, image, showLogo, onMenuClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Add check for signup page
  const isSignupPage = router.pathname === '/payment';

  const handleUserSectionClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(`.${styles.userInfo}`)) {
      setShowDropdown(false);
    }
  };

  // Replace useState with useEffect for event listener
  useEffect(() => {
    // Only add the listener if we're in a browser environment
    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleClickOutside);
      
      // Cleanup function
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, []); // Empty dependency array means this only runs once on mount

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.menuButton} onClick={onMenuClick}>
          <span className={styles.hamburger}></span>
        </button>
        
        {showLogo && (
          <div className={styles.logoContainer}>
            <Image
              src={logoImage}
              alt="Pure Medspa"
              width={150}
              height={40}
              priority
            />
          </div>
        )}
      </div>

      {!isSignupPage && (
        <div className={styles.userSection}>
          {/* <div className={styles.notificationIcon}>
            <Image
              src={bellIcon}
              alt="Notifications"
              width={24}
              height={24}
              priority
            />
            <span className={styles.notificationBadge}>2</span>
          </div> */}
          <div className={styles.userInfo} onClick={handleUserSectionClick}>
            <div className={styles.profilePic}>
              <div className={styles.avatarContainer}>
                {image ? (
                  <img 
                    src={image} 
                    alt={userName || 'User profile'} 
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {userName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userType}>
                {userType} <span className={styles.dropdownArrow}>▼</span>
              </span>
            </div>

            {showDropdown && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownItem} onClick={handleLogout}>
                  <Image
                    src="/assets/icons/logoutIcon.png"
                    alt="Logout"
                    width={20}
                    height={20}
                  />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 