import { Client } from '@/Client/Client.tsx';
import { Server } from '@/Server/Server.tsx';
import styles from './Game.module.scss';

const Game = () => {
    const serverPeerId = window.location.pathname.replace('/mega-tic-tac-toe/', '') ?? null;

    return <div className={styles.container}>{serverPeerId ? <Client serverPeerId={serverPeerId} /> : <Server />}</div>;
};

export { Game };
