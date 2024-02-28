import styles from './Wizard.module.scss';
import { ChangeEvent } from 'react';

export type WizardProps = {
    name: string;
    onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onNameChangeComplete: () => void;
};

export const Wizard = ({ name, onNameChange, onNameChangeComplete }: WizardProps) => {
    return (
        <div className={styles.container}>
            <input
                value={name}
                onChange={onNameChange}
                placeholder='Enter your name'
            />
            <button
                onClick={onNameChangeComplete}
                disabled={!name}
            >
                Start game
            </button>
        </div>
    );
};
