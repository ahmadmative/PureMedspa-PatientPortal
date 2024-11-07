import Image from 'next/image';
import styles from './EditProfileComponent.module.css';
import Input from '../Input';
import { useState } from 'react';

function EditProfileComponent() {
    const [relation, setRelation] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [homePhone, setHomePhone] = useState('');
    const [guardianFirstName, setGuardianFirstName] = useState('');
    const [guardianLastName, setGuardianLastName] = useState('');
    const [guardianDateOfBirth, setGuardianDateOfBirth] = useState('');

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <div className={styles.profileSection}>
                    <div className={styles.profilePicture}>
                        <div className={styles.avatarPlaceholder}></div>
                    </div>
                    <button className={styles.uploadButton}>
                        <Image
                            src="/assets/icons/upload.png"
                            alt="Upload"
                            width={20}
                            height={20}
                        />
                        Change Profile Picture
                    </button>
                </div>

                <div className={styles.formSection}>
                    <form className={styles.form}>

                        <div className={styles.formRow}>
                            <Input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={styles.inputField}
                            />
                            <Input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <Input
                                type="date"
                                placeholder="Date of Birth"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className={styles.inputField}
                            />
                            <select 
                                className={styles.select} 
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="" disabled>Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input
                            type="text"
                            placeholder="Address 1"
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            className={styles.inputField}
                        />
                        <Input
                            type="text"
                            placeholder="Address 2"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            className={styles.inputField}
                        />

                        <div className={styles.formRow}>
                            <Input
                                type="text"
                                placeholder="Zipcode"
                                value={zipcode}
                                onChange={(e) => setZipcode(e.target.value)}
                                className={styles.inputField}
                            />
                            <Input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <Input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className={styles.inputField}
                            />
                            <Input
                                type="tel"
                                placeholder="Cell Phone"
                                value={cellPhone}
                                onChange={(e) => setCellPhone(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>

                        <Input
                            type="tel"
                            placeholder="Home Phone"
                            value={homePhone}
                            onChange={(e) => setHomePhone(e.target.value)}
                            className={styles.inputField}
                        />

                        <div className={styles.buttonContainer}>
                            <button type="button" className={styles.saveButton}>
                                <Image
                                    src="/assets/icons/save.png"
                                    alt="Save"
                                    width={20}
                                    height={20}
                                />
                                Save
                            </button>
                            <button type="submit" className={styles.sendButton}>
                                Send Invitation →
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfileComponent; 