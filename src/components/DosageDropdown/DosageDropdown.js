import styles from './DosageDropdown.module.css';

const DosageDropdown = ({ strengths, value, onChange, disabled }) => {
    return (
        <select
            className={styles.select}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
        >
            <option value="">Select Dosage</option>
            {strengths?.map((strength) => (
                <option key={strength.Id} value={strength.text}>
                    {strength.text}
                </option>
            ))}
        </select>
    );
};

export default DosageDropdown; 