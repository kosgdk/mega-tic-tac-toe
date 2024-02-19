import styles from './Server.module.scss';
import { GameField } from '@/GameField/GameField.tsx';
import { Wizard } from '@/Server/parts/Wizard/Wizard.tsx';
import { useServer } from '@/Server/useServer.ts';

const Server = () => {
    const {
        field,
        winner,
        onChildCellClick,
        parentCellsAvailableForMove,
        serverPlayer,
        clientPlayer,
        isClientMove,
        onServerPlayerNameChange,
        onServerPlayerNameChangeComplete
    } = useServer();

    return (
        <div className={styles.container}>
            {!clientPlayer.peerId && (
                <Wizard
                    name={serverPlayer.name}
                    peerId={serverPlayer.peerId}
                    onNameChange={onServerPlayerNameChange}
                    onNameChangeComplete={onServerPlayerNameChangeComplete}
                />
            )}

            {winner && <h1 className={styles.winner}>{`${winner} won!`}</h1>}

            <GameField
                field={field}
                disabled={isClientMove}
                onChildCellClick={onChildCellClick}
                parentCellsAvailableForMove={parentCellsAvailableForMove}
            />
        </div>
    );
};

export { Server };
