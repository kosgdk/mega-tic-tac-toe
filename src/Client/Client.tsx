import { GameField } from '@/GameField/GameField.tsx';
import { useClient } from '@/Client/useClient.ts';
import styles from './Client.module.scss';
import { Wizard } from '@/Client/parts/Wizard/Wizard.tsx';
import { GameStatus } from '@/Client/GameStatus/GameStatus.tsx';

export type ClientProps = {
    serverPeerId: string;
};

const Client = ({ serverPeerId }: ClientProps) => {
    const {
        field,
        winner,
        parentCellsAvailableForMove,
        clientPlayer,
        serverPlayer,
        isClientMove,
        name,
        onNameChange,
        onNameChangeComplete,
        onChildCellClick
    } = useClient(serverPeerId);

    const showField = field && clientPlayer && serverPlayer;

    return (
        <div className={styles.container}>
            {showField ? (
                <>
                    <GameStatus
                        currentPlayer={clientPlayer!}
                        opponentPlayer={serverPlayer!}
                        isCurrentPlayerTurn={isClientMove}
                        winner={winner}
                    />
                    <GameField
                        field={field}
                        disabled={!!winner || !isClientMove}
                        onChildCellClick={onChildCellClick}
                        parentCellsAvailableForMove={parentCellsAvailableForMove}
                    />
                </>
            ) : (
                <Wizard
                    name={name}
                    onNameChange={onNameChange}
                    onNameChangeComplete={onNameChangeComplete}
                />
            )}
        </div>
    );
};

export { Client };
