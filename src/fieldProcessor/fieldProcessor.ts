import { CellCoordinates, CellCoordinatesStringRepresentation, CellValue, ChildField, Field } from '@/Game/useGame.ts';

export const generateEmptyField = (size: number): Field =>
    Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({ value: null, field: generateEmptyChildField(size) }))
    );

export const generateEmptyChildField = (size: number): ChildField =>
    Array.from({ length: size }, () => Array.from({ length: size }, () => ({ value: null })));

export const getWinner = (childField: ChildField): CellValue | null => {
    const rows = childField.map((row) => row.map((cell) => cell.value));
    const columns = childField[0].map((_, i) => childField.map((row) => row[i].value));
    const diagonals = [
        childField.map((row, i) => row[i].value),
        childField.map((row, i) => row[row.length - 1 - i].value)
    ];
    const lines = [...rows, ...columns, ...diagonals];
    for (const line of lines) {
        const firstValue = line[0];
        if (line.every((cellValue) => cellValue && firstValue && cellValue === firstValue)) {
            return firstValue;
        }
    }
    return null;
};

export const getParentCellsAvailableForMove = (
    field: Field,
    lastMoveChildCellCoordinates: CellCoordinates | null
): Set<CellCoordinatesString> => {
    if (lastMoveChildCellCoordinates) {
        const directParentCell = field[lastMoveChildCellCoordinates.row][lastMoveChildCellCoordinates.column];
        if (!directParentCell.value) {
            const coordinatesString: CellCoordinatesString = `${lastMoveChildCellCoordinates.row}-${lastMoveChildCellCoordinates.column}`;
            return new Set([coordinatesString]);
        }
    }

    return new Set(
        field.reduce((result, row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                if (!cell.value) {
                    const coordinatesString: CellCoordinatesString = `${rowIndex}-${columnIndex}`;
                    result.push(coordinatesString);
                }
            });
            return result;
        }, [] as CellCoordinatesString[])
    );
};
