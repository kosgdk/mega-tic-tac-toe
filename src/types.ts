import { CellValueChar } from '@/constants.ts';

export type CellValue = CellValueChar | null;

export type ChildCellDefinition = {
    value: CellValue;
};

export type ChildField = ChildCellDefinition[][];

export type ParentCellDefinition = {
    value: CellValue;
    field: ChildField;
};

export type CellCoordinates = {
    row: number;
    column: number;
};

export type Field = ParentCellDefinition[][];

export type CellCoordinatesStringRepresentation = `${number}-${number}`;

export type Player = {
    peerId: string;
    name: string;
    cellValueChar: CellValueChar;
};

export enum MessageType {
    PING = 'PING',
    PONG = 'PONG',
    GAME_STATE = 'GAME_STATE',
    GAME_MOVE = 'GAME_MOVE',
    CLIENT_PLAYER_NAME = 'CLIENT_PLAYER_NAME'
}

export type BaseMessage = {
    type: MessageType;
    payload: unknown;
};

export type PingMessage = BaseMessage & {
    type: MessageType.PING | MessageType.PONG;
    payload?: never;
};

export type ClientPlayerNameMessage = BaseMessage & {
    type: MessageType.CLIENT_PLAYER_NAME;
    payload: string;
};

export type GameStateMessage = BaseMessage & {
    type: MessageType.GAME_STATE;
    payload: {
        field: Field;
        winner: Player | null;
        parentCellsAvailableForMove: CellCoordinatesStringRepresentation[];
        isClientMove: boolean;
        serverPlayer: Player;
        clientPlayer: Player;
    };
};

export type GameMoveMessage = BaseMessage & {
    type: MessageType.GAME_MOVE;
    payload: {
        parentCellCoordinates: CellCoordinates;
        childCellCoordinates: CellCoordinates;
    };
};
