import { useGame } from '@/Game/useGame.ts';
import styles from './Game.module.scss';
import { GameField } from '@/GameField/GameField.tsx';

declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number;
    }
}

const Game = () => {
    const { field, onChildCellClick, winner, parentCellsAvailableForMove } = useGame();

    return (
        <div className={styles.container}>
            {winner && <h1 className={styles.winner}>{`${winner} won!`}</h1>}

            <GameField
                field={field}
                onChildCellClick={onChildCellClick}
                parentCellsAvailableForMove={parentCellsAvailableForMove}
            />
        </div>
    );
};

export { Game };
