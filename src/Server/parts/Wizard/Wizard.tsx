import styles from './Wizard.module.scss';
import { ChangeEvent } from 'react';

export type WizardProps = {
    name: string;
    peerId: string;
    onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onNameChangeComplete: () => void;
};

export const Wizard = ({ name, peerId, onNameChange, onNameChangeComplete }: WizardProps) => {
    const shareableUrl = `${window.location.href}${peerId}`;

    const onShareClick = () => {
        navigator.share({
            url: shareableUrl
        });
    };

    return (
        <div className={styles.container}>
            {peerId ? (
                <>
                    <div>{shareableUrl}</div>
                    <button onClick={onShareClick}>Share</button>
                </>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};
