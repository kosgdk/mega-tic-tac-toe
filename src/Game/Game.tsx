import { Client } from '@/Client/Client.tsx';
import { Server } from '@/Server/Server.tsx';
import styles from './Game.module.scss';
import { URL_GAME_PARAM_NAME } from '@/constants.ts';

const Game = () => {
    const serverPeerId = new URLSearchParams(window.location.search).get(URL_GAME_PARAM_NAME);

    return <div className={styles.container}>{serverPeerId ? <Client serverPeerId={serverPeerId} /> : <Server />}</div>;
};

export { Game };
