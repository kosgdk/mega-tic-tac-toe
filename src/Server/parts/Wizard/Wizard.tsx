import styles from './Wizard.module.scss';
import { ChangeEvent } from 'react';

export type WizardProps = {
    name: string;
    peerId: string;
    onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onNameChangeComplete: () => void;
};

export const Wizard = ({ name, peerId, onNameChange, onNameChangeComplete }: WizardProps) => {
    return (
        <div className={styles.container}>
            {peerId ? (
                <div>
                    <div>{`${window.location.origin}/${peerId}`}</div>
                    <button>Share</button>
                </div>
            ) : (
                <div>
                    <input
                        value={name}
                        onChange={onNameChange}
                        placeholder='Enter your name'
                    />
                    <button
                        onClick={onNameChangeComplete}
                        disabled={!name}
                    >
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
};
