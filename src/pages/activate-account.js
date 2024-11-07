import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Image from 'next/image';
import styles from '../styles/ActivateAccount.module.css';
import successIcon from '../../public/assets/icons/success.png';

export default function ActivateAccount() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        gender: '',
        cellPhone: '',
        zipcode: '',
        state: '',
        city: '',
        address1: '',
        address2: '',
    });
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle account activation logic here
        
        // After successful activation:
        setShowModal(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className={styles.container}>
            <Header 
                userName="Jalin Smith" 
                userType="Patient" 
                showLogo={true}
            />

            <main className={styles.main}>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <div className={styles.formHeaderText}>
                            <Image 
                                src="/assets/icons/profileIcon.png"
                                alt="Profile Icon"
                                width={32}
                                height={32}
                            />
                            <h1>Activate Account</h1>
                        </div>
                        <p>Hello Jalin Smith,<br />Altura Health has invited you. Please setup your password to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />

                        <div className={styles.twoColumns}>
                            <Input
                                type="date"
                                name="dateOfBirth"
                                placeholder="Date of Birth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className={styles.twoColumns}>
                            <Input
                                type="tel"
                                name="cellPhone"
                                placeholder="Cell Phone"
                                value={formData.cellPhone}
                                onChange={handleChange}
                            />
                            <Input
                                type="text"
                                name="zipcode"
                                placeholder="Zipcode"
                                value={formData.zipcode}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.twoColumns}>
                            <Input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                            />
                            <Input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.twoColumns}>
                            <Input
                                type="text"
                                name="address1"
                                placeholder="Address 1"
                                value={formData.address1}
                                onChange={handleChange}
                            />
                            <Input
                                type="text"
                                name="address2"
                                placeholder="Address 2"
                                value={formData.address2}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ marginTop: '1rem' }}/>
                        <Button type="submit" width="300px">
                            Activate
                        </Button>
                    </form>
                </div>

                <div className={styles.infoSection}>
                    <h2>With Altura Health Care get started in a few minutes</h2>
                    <ul>
                        <li>Average Emergency Room wait: 90 minutes</li>
                        <li>Average Urgent Care wait: 60 minutes</li>
                        <li>Average Physician Office wait: 30 minutes</li>
                        <li>No narcotic pain killers will be prescribed under any circumstances</li>
                    </ul>
                </div>
            </main>

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
                            width={120}
                            height={120}
                            className={styles.successIcon}
                        />
                        <h2>Activated Successfully</h2>
                        <p>Your profile has been activated<br/>successfully</p>
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