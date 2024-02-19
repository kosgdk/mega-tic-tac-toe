import { GameField } from '@/GameField/GameField.tsx';
import { useClient } from '@/Client/useClient.ts';
import styles from './Client.module.scss';
import { Wizard } from '@/Client/parts/Wizard/Wizard.tsx';

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

    return (
        <div className={styles.container}>
            {winner && <h1 className={styles.winner}>{`${winner} won!`}</h1>}

            {field ? (
                <GameField
                    field={field}
                    disabled={!isClientMove}
                    onChildCellClick={onChildCellClick}
                    parentCellsAvailableForMove={parentCellsAvailableForMove}
                />
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
