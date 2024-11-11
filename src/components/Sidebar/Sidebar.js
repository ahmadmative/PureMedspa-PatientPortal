import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { title: 'Dashboard', icon: '/assets/icons/dashboardIcon.png', activeIcon: '/assets/icons/dashboardIconBlue.png', path: '/dashboard' },
    // { title: 'Add Spouse', icon: '/assets/icons/addSpouseIcon.png', activeIcon: '/assets/icons/addSpouseIconBlue.png', path: '/add-spouse' },
    { title: 'Request Consultation', icon: '/assets/icons/requestConsultationIcon.png', activeIcon: '/assets/icons/requestConsultationIconBlue.png', path: '/consultation' },
    { title: 'Health History', icon: '/assets/icons/healthHistoryIcon.png', activeIcon: '/assets/icons/healthHistoryIconBlue.png', path: '/health-history' },
    { title: 'Edit Profile', icon: '/assets/icons/settingsIcon.png', activeIcon: '/assets/icons/settingsIconBlue.png', path: '/edit-profile' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Image src="/assets/images/logo.png" alt="Logo" width={140} height={40} />
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link
            href={item.path}
            key={item.title}
            className={`${styles.menuItem} ${currentPath === item.path ? styles.active : ''}`}
          >
            <Image src={currentPath === item.path ? item.activeIcon : item.icon} alt={item.title} width={22} height={22} />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 