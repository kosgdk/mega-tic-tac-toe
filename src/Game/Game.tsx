import { Client } from '@/Client/Client.tsx';
import { Server } from '@/Server/Server.tsx';

const Game = () => {
    const serverPeerId = window.location.pathname.replace('/', '') ?? null;

    return serverPeerId ? <Client serverPeerId={serverPeerId} /> : <Server />;
};

export { Game };
