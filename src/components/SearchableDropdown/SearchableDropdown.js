import { useState, useRef, useEffect } from 'react';
import styles from './SearchableDropdown.module.css';
import { medicationService } from '../../api/services/medication.service';
import { allergyService } from '../../api/services/allergy.service';

const SearchableDropdown = ({ value, onChange, onMedicationSelect, placeholder, apiEndpoint = 'medication' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchItems = async () => {
            if (searchTerm.length >= 3) {
                setLoading(true);
                try {
                    let data;
                    if (apiEndpoint === 'allergy') {
                        data = await allergyService.searchAllergies(searchTerm);
                    } else {
                        data = await medicationService.searchMedications(searchTerm);
                    }
                    setResults(data);
                } catch (error) {
                    console.error('Error searching:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        };

        const debounceTimer = setTimeout(searchItems, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, apiEndpoint]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onChange(value);
        setIsOpen(true);
    };

    const handleItemSelect = (item) => {
        onMedicationSelect(item);
        setSearchTerm(item.text);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className={`${styles.input} ${isOpen ? styles.inputActive : ''}`}
            />
            {isOpen && (
                <div className={styles.dropdown}>
                    {loading && (
                        <div className={styles.messageBox}>Loading...</div>
                    )}
                    {!loading && searchTerm.length < 3 && (
                        <div className={styles.messageBox}>
                            Please enter 3 or more characters
                        </div>
                    )}
                    {!loading && searchTerm.length >= 3 && results.length === 0 && (
                        <div className={styles.messageBox}>No results found</div>
                    )}
                    {!loading && results.map((item) => (
                        <div 
                            key={item.id}
                            className={styles.dropdownItem}
                            onClick={() => handleItemSelect(item)}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown; 