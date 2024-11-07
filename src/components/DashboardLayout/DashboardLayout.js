import { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header';
import styles from './DashboardLayout.module.css';
import { authService } from '../../api/services/auth.service';


const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();

    console.log(user);

    if (user) {
      // Format the data according to your needs
      setProfileData({
        name: `${user.first_name} ${user.last_name}`,
        image: user.profileImage || '/assets/images/person1.png', // fallback image
        gender: user.gender || 'Not specified',
        dob: user.dob, // You'll need to format the date
        phone: user.phone_no, // Format phone number
        email: user.email,
        address: user.city + ', ' + user.state + ', ' + user.zipcode
      });
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layout}>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <Sidebar />
      </div>
      <div className={styles.mainWrapper}>
        <Header 
          showProfileMenu={true}
          userName={profileData?.name || ''}
          userType={"Patient"}
          image={profileData?.image || '/assets/images/person1.png'}
          onMenuClick={toggleSidebar}
        />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 