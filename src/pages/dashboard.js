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
import { useEffect, useState } from 'react';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [renderPharmacy, setRenderPharmacy] = useState(false);
  const [renderPhysicians, setRenderPhysicians] = useState(false);
  const [renderHealthHistory, setRenderHealthHistory] = useState(false);
  const [renderConsultations, setRenderConsultations] = useState(false);

  useEffect(() => {
    const user = window.localStorage.getItem('USER');
    const token = window.localStorage.getItem('ACCESS_TOKEN');
    if (user) setUser(JSON.parse(user));
    if (token) setToken(token);
  }, []);

  // Introduce delays before rendering each component
  useEffect(() => {
    const delayPharmacy = setTimeout(() => setRenderPharmacy(true), 1000); // 500ms delay
    const delayPhysicians = setTimeout(() => setRenderPhysicians(true), 2000); // 1000ms delay
    const delayHealthHistory = setTimeout(() => setRenderHealthHistory(true), 3000); // 1500ms delay
    const delayConsultations = setTimeout(() => setRenderConsultations(true), 4000); // 1500ms delay

    return () => {
      clearTimeout(delayPharmacy);
      clearTimeout(delayPhysicians);
      clearTimeout(delayHealthHistory);
      clearTimeout(delayConsultations);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          {renderPharmacy && <Pharmacy patientId={user?.patient_id} />}
          <div style={{ height: '24px' }} />
          {renderPhysicians && <Physicians patientId={user?.patient_id} />}
        </div>
        <div className={styles.rightColumn}>
          <Profile />
          <div style={{ height: '24px' }} />
          {renderConsultations && <Consultations />}
          <div style={{ height: '24px' }} />
          <Documents />
          <div style={{ height: '24px' }} />
          {renderHealthHistory && <HealthHistory patientId={user?.patient_id} />}
        </div>
      </div>
    </DashboardLayout>
  );
}

const WrappedDashboard = withAuth(Dashboard);
export default WrappedDashboard;
