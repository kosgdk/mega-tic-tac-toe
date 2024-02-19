import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { CellValueChar } from '@/constants.ts';
import {
    BaseMessage,
    CellCoordinates,
    CellCoordinatesStringRepresentation,
    ClientPlayerNameMessage,
    Field,
    GameStateMessage,
    MessageType,
    Player
} from '@/types.ts';
import { DataConnection, Peer } from 'peerjs';
import { useToggle } from '@react-hookz/web';

export const useClient = (serverPeerId: string) => {
    const connection = useRef<DataConnection>();
    const [name, setName] = useState('');
    const [serverPlayer, setServerPlayer] = useState<Player | null>();
    const [clientPlayer, setClientPlayer] = useState<Player | null>();
    const [field, setField] = useState<Field | null>();
    const [winner, setWinner] = useState<Player | null>(null);
    const [parentCellsAvailableForMove, setParentCellsAvailableForMove] = useState<
        Set<CellCoordinatesStringRepresentation>
    >(new Set());
    const [isClientMove, toggleIsClientMove] = useToggle(clientPlayer?.cellValueChar === CellValueChar.X);

    const onNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const onChildCellClick = useCallback(
        (parentCellCoordinates: CellCoordinates, childCellCoordinates: CellCoordinates) => {
            toggleIsClientMove();
            connection.current?.send({
                type: MessageType.GAME_MOVE,
                payload: {
                    parentCellCoordinates,
                    childCellCoordinates
                }
            });
        },
        [toggleIsClientMove]
    );

    const onGameStateReceived = useCallback(
        (message: GameStateMessage) => {
            setClientPlayer(message.payload.clientPlayer);
            setServerPlayer(message.payload.serverPlayer);
            setWinner(message.payload.winner);
            setParentCellsAvailableForMove(new Set(message.payload.parentCellsAvailableForMove));
            setField(message.payload.field);
            toggleIsClientMove(message.payload.isClientMove);
        },
        [toggleIsClientMove]
    );

    const connectToServer = useCallback(() => {
        const peer = new Peer();

        peer.on('open', (peerId) => {
            const _connection = peer.connect(serverPeerId!, {
                metadata: {
                    id: peerId
                }
            });

            connection.current = _connection;

            _connection.on('open', () => {
                const clientPlayerNameMessage: ClientPlayerNameMessage = {
                    type: MessageType.CLIENT_PLAYER_NAME,
                    payload: name
                };
                _connection.send(clientPlayerNameMessage);
            });

            _connection.on('data', (data) => {
                console.log('Data received from server', data);
                const message = data as BaseMessage;
                switch (message.type) {
                    case MessageType.GAME_STATE: {
                        onGameStateReceived(message as GameStateMessage);
                        break;
                    }
                    default: {
                        console.log('Unknown message received from server', data);
                    }
                }
            });

            _connection.on('close', () => {
                console.log('Server disconnected', _connection.metadata.id);
            });
        });

        return () => {
            connection.current?.close();
            peer.destroy();
        };
    }, [name, onGameStateReceived, serverPeerId]);

    return {
        field,
        winner,
        parentCellsAvailableForMove,
        clientPlayer,
        serverPlayer,
        name,
        onNameChange,
        onNameChangeComplete: connectToServer,
        onChildCellClick,
        isClientMove
    };
};
