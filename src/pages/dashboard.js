import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import Members from '../components/Members/Members';
import Pharmacy from '../components/Pharmacy/Pharmacy';
import Physicians from '../components/Physicians/Physicians';
import Profile from '../components/Profile/Profile';
import Consultations from '../components/Consultations/Consultations';
import Documents from '../components/Documents/Documents';
import HealthHistory from '../components/HealthHistory/HealthHistory';
import styles from '../styles/Dashboard.module.css';
import { withAuth } from '../components/withAuth';
import { authService } from '../api/services/auth.service';
import { useEffect, useState } from 'react';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setUser(user);
    }
    else {
      console.log('No user found');
    } 
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <Members />
          <div style={{height: '24px'}}/>
          <Pharmacy patientId={user?.patient_id} />
          <div style={{height: '24px'}}/>
          <Physicians />
        </div>
        <div className={styles.rightColumn}>
          <Profile />
          <div style={{height: '24px'}}/>
          <Consultations />
          <div style={{height: '24px'}}/>
          <Documents />
          <div style={{height: '24px'}}/>
          <HealthHistory patientId={user?.patient_id}/>
        </div>
      </div>
    </DashboardLayout>
  );
}

const WrappedDashboard = withAuth(Dashboard);
export default WrappedDashboard; 