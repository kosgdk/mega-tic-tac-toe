import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { CellValueChar, FIELD_SIZE } from '@/constants.ts';
import { cloneDeep } from 'lodash';
import {
    BaseMessage,
    CellCoordinates,
    CellCoordinatesStringRepresentation,
    Field,
    GameMoveMessage,
    GameStateMessage,
    MessageType,
    Player
} from '@/types.ts';
import {
    generateEmptyField,
    getParentCellsAvailableForMove,
    getWinnerCellValueChar
} from '@/fieldProcessor/fieldProcessor.ts';
import { DataConnection, Peer } from 'peerjs';
import useEvent from 'react-use-event-hook';

export const useServer = () => {
    const clientConnection = useRef<DataConnection>();
    const [serverPlayer, setServerPlayer] = useState<Player>({
        peerId: '',
        name: '',
        cellValueChar: Math.random() > 0.5 ? CellValueChar.X : CellValueChar.O
    });
    const [clientPlayer, setClientPlayer] = useState<Player>({
        peerId: '',
        name: '',
        cellValueChar: serverPlayer.cellValueChar === CellValueChar.X ? CellValueChar.O : CellValueChar.X
    });
    const [field, setField] = useState<Field>(generateEmptyField(FIELD_SIZE));
    const [isClientMove, setIsClientMove] = useState(serverPlayer.cellValueChar === CellValueChar.O);
    const [winner, setWinner] = useState<Player | null>(null);
    const [parentCellsAvailableForMove, setParentCellsAvailableForMove] = useState<
        Set<CellCoordinatesStringRepresentation>
    >(getParentCellsAvailableForMove(field, null));
    const [isClientReady, setIsClientReady] = useState(false);

    const onChildCellClick = useEvent(
        (parentCellCoordinates: CellCoordinates, childCellCoordinates: CellCoordinates) => {
            const effectiveField = cloneDeep(field);

            const targetParentCell = effectiveField[parentCellCoordinates.row][parentCellCoordinates.column];
            targetParentCell.field[childCellCoordinates.row][childCellCoordinates.column].value = isClientMove
                ? clientPlayer.cellValueChar
                : serverPlayer.cellValueChar;
            targetParentCell.value = getWinnerCellValueChar(targetParentCell.field);

            setField(effectiveField);

            const winner = getWinnerCellValueChar(effectiveField);
            if (winner) {
                setWinner(serverPlayer.cellValueChar === winner ? serverPlayer : clientPlayer);
            }

            const parentCellsAvailableForMove = getParentCellsAvailableForMove(effectiveField, childCellCoordinates);
            setParentCellsAvailableForMove(parentCellsAvailableForMove);

            const newIsClientMove = !isClientMove;
            setIsClientMove(newIsClientMove);

            const gameStateMessage: GameStateMessage = {
                type: MessageType.GAME_STATE,
                payload: {
                    field: cloneDeep(effectiveField),
                    winner: winner ? (winner === serverPlayer.cellValueChar ? serverPlayer : clientPlayer) : null,
                    parentCellsAvailableForMove: Array.from(parentCellsAvailableForMove),
                    isClientMove: newIsClientMove,
                    clientPlayer,
                    serverPlayer
                }
            };
            clientConnection.current?.send(gameStateMessage);
        }
    );

    const onClientConnectionEstablished = useEvent((connection: DataConnection) => {
        console.log('Client connection established', connection.metadata.id);
        clientConnection.current = connection;
        setClientPlayer((prev) => ({
            ...prev,
            peerId: connection.metadata.id,
            name: connection.metadata.name
        }));
    });

    const sentInitialGameStateToClient = useEvent(() => {
        const gameStateMessage: GameStateMessage = {
            type: MessageType.GAME_STATE,
            payload: {
                field,
                winner: null,
                parentCellsAvailableForMove: Array.from(parentCellsAvailableForMove),
                isClientMove,
                clientPlayer,
                serverPlayer
            }
        };
        console.log('Sending game state to client', gameStateMessage);
        clientConnection.current!.send(gameStateMessage);
    });

    useEffect(() => {
        if (isClientReady && clientPlayer) {
            sentInitialGameStateToClient();
        }
    }, [isClientReady, clientPlayer, sentInitialGameStateToClient]);

    const onClientReady = useEvent(() => {
        console.log('Client ready');
        setIsClientReady(true);
    });

    const onClientMove = useCallback(
        (message: GameMoveMessage) => {
            console.log('Client made a move', isClientMove, message.payload);
            onChildCellClick(message.payload.parentCellCoordinates, message.payload.childCellCoordinates);
        },
        [isClientMove, onChildCellClick]
    );

    const onServerPlayerNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setServerPlayer((prev) => ({ ...prev, name: e.target.value }));
    }, []);

    const onClientMessageReceived = useEvent((message: BaseMessage) => {
        switch (message.type) {
            case MessageType.CLIENT_PLAYER_READY: {
                onClientReady();
                break;
            }
            case MessageType.GAME_MOVE: {
                onClientMove(message as GameMoveMessage);
                break;
            }
            default: {
                console.log('Unknown message received from client', message);
            }
        }
    });

    const initPeer = useEvent(() => {
        const peer = new Peer();

        peer.on('open', (id) => {
            setServerPlayer((prev) => ({ ...prev, peerId: id }));
        });

        peer.on('connection', (conn) => {
            onClientConnectionEstablished(conn);

            conn.on('data', (data) => {
                onClientMessageReceived(data as BaseMessage);
            });

            conn.on('close', () => {
                console.log('Client disconnected', conn.metadata.id);
            });
        });
    });

    return {
        field,
        winner,
        onChildCellClick,
        parentCellsAvailableForMove,
        serverPlayer,
        clientPlayer,
        isClientMove,
        onServerPlayerNameChange,
        onServerPlayerNameChangeComplete: initPeer
    };
};
