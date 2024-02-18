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
