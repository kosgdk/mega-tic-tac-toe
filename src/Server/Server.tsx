import styles from './Server.module.scss';
import { GameField } from '@/GameField/GameField.tsx';
import { Wizard } from '@/Server/parts/Wizard/Wizard.tsx';
import { useServer } from '@/Server/useServer.ts';
import { GameStatus } from '@/Client/GameStatus/GameStatus.tsx';

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
            {clientPlayer.peerId ? (
                <>
                    <GameStatus
                        currentPlayer={serverPlayer}
                        opponentPlayer={clientPlayer}
                        isCurrentPlayerTurn={!isClientMove}
                        winner={winner}
                    />
                    <GameField
                        field={field}
                        disabled={!!winner || isClientMove}
                        onChildCellClick={onChildCellClick}
                        parentCellsAvailableForMove={parentCellsAvailableForMove}
                    />
                </>
            ) : (
                <Wizard
                    name={serverPlayer.name}
                    peerId={serverPlayer.peerId}
                    onNameChange={onServerPlayerNameChange}
                    onNameChangeComplete={onServerPlayerNameChangeComplete}
                />
            )}
        </div>
    );
};

export { Server };
