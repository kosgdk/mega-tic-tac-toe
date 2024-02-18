import { useCallback, useState } from 'react';
import { CellValueChar, FIELD_SIZE } from '@/constants.ts';
import { cloneDeep } from 'lodash';
import { CellCoordinates, CellCoordinatesStringRepresentation, CellValue, Field } from '@/types.ts';
import { generateEmptyField, getParentCellsAvailableForMove, getWinner } from '@/fieldProcessor/fieldProcessor.ts';

export const useGame = () => {
    const [field, setField] = useState<Field>(generateEmptyField(FIELD_SIZE));
    const [currentPlayerValue, setCurrentPlayerValue] = useState<CellValue>(CellValueChar.X);
    const [winner, setWinner] = useState<CellValue | null>(null);
    const [parentCellsAvailableForMove, setParentCellsAvailableForMove] = useState<
        Set<CellCoordinatesStringRepresentation>
    >(getParentCellsAvailableForMove(field, null));

    const togglePlayer = useCallback(() => {
        setCurrentPlayerValue((prev) => (prev === CellValueChar.X ? CellValueChar.O : CellValueChar.X));
    }, []);

    const onChildCellClick = useCallback(
        (parentCellCoordinates: CellCoordinates, childCellCoordinates: CellCoordinates) => {
            console.log(parentCellCoordinates, childCellCoordinates);
            const effectiveField = cloneDeep(field);

            const targetParentCell = effectiveField[parentCellCoordinates.row][parentCellCoordinates.column];
            targetParentCell.field[childCellCoordinates.row][childCellCoordinates.column].value = currentPlayerValue;
            targetParentCell.value = getWinner(targetParentCell.field);

            setField(effectiveField);

            const winner = getWinner(effectiveField);
            if (winner) {
                setWinner(winner);
            }

            setParentCellsAvailableForMove(getParentCellsAvailableForMove(effectiveField, childCellCoordinates));

            togglePlayer();
        },
        [field, currentPlayerValue, togglePlayer]
    );

    return {
        field,
        winner,
        onChildCellClick,
        parentCellsAvailableForMove
    };
};
