import { Player } from '@/types.ts';
import { CellValueChar } from '@/constants.ts';
import { Cross } from '@/CellValues/Cross.tsx';
import { Circle } from '@/CellValues/Circle.tsx';
import styles from './GameStatus.module.scss';

export type GameStatusProps = {
    isCurrentPlayerTurn: boolean;
    opponentPlayer: Player;
    currentPlayer: Player;
    winner: Player | null;
};

export const GameStatus = ({ isCurrentPlayerTurn, opponentPlayer, currentPlayer, winner }: GameStatusProps) => (
    <div className={styles.container}>
        <div className={styles.players}>
            <PlayerInfo player={currentPlayer} />
            <PlayerInfo player={opponentPlayer} />
        </div>
        <div className={styles.status}>
            {winner
                ? `${winner.peerId === currentPlayer.peerId ? 'You' : opponentPlayer.name} won`
                : isCurrentPlayerTurn
                ? 'Your turn'
                : `${opponentPlayer.name}'s turn`}
        </div>
    </div>
);

type PlayerInfoProps = {
    player: Player;
};

const PlayerInfo = ({ player }: PlayerInfoProps) => (
    <div className={styles.playerInfo}>
        {player.cellValueChar === CellValueChar.X ? Cross : Circle}
        {player.name}
    </div>
);
