import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../Button/Button';
import styles from './Profile.module.css';
import { useRouter } from 'next/router';
import { authService } from '../../api/services/auth.service';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();

    console.log(user);

    console.log('patientId:', user.patient_id);
    if (user) {
      // Format the data according to your needs
      setProfileData({
        name: `${user.first_name} ${user.last_name}`,
        image: user.profileImage || '/assets/images/person1.png', // fallback image
        gender: user.gender || 'Not specified',
        dob: formatDate(user.dob), // You'll need to format the date
        phone: formatPhone(user.phone_no), // Format phone number
        email: user.email,
        address: user.city + ', ' + user.state + ', ' + user.zipcode
      });
    }
  }, []);

  // Helper functions for formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Not specified';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  const formatAddress = (address) => {
    if (!address) return 'Not specified';
    return [
      address.street1,
      address.street2,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean).join(', ');
  };

  const handleEditProfileClick = () => {
    router.push('/edit-profile');
  };

  if (!profileData) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.profileInfo}>
          <Image 
            src={profileData.image} 
            alt={profileData.name} 
            width={80} 
            height={80} 
            className={styles.profileImage}
          />
          <div className={styles.profileDetails}>
            <h2 className={styles.name}>{profileData.name}</h2>
            <span className={styles.basicInfo}>
              {profileData.gender} | {profileData.dob}
            </span>
          </div>
        </div>
        <Button 
          icon="/assets/icons/editIcon.png"
          variant="primary"
          onClick={handleEditProfileClick}
        >
          Edit Profile
        </Button>
      </div>
      <div className={styles.contactInfo}>
        <div className={styles.infoItem}>
          <Image src="/assets/icons/phoneIcon.png" alt="Phone" width={24} height={24} />
          <span>{profileData.phone}</span>
        </div>
        <div className={styles.infoItem}>
          <Image src="/assets/icons/mailIcon.png" alt="Email" width={23} height={16} />
          <span>{profileData.email}</span>
        </div>
        <div className={styles.infoItem}>
          <Image src="/assets/icons/locationIcon.png" alt="Location" width={17} height={28.5} />
          <span>{profileData.address}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile; 