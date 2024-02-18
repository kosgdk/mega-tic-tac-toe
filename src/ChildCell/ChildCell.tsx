import styles from './ChildCell.module.scss';
import { Cross } from '@/CellValues/Cross.tsx';
import { Circle } from '@/CellValues/Circle.tsx';
import { CellValueChar } from '@/constants.ts';
import { CellCoordinates, CellValue } from '@/types.ts';

export type ChildCellProps = {
    value: CellValue;
    coordinates: CellCoordinates;
    parentCellCoordinates: CellCoordinates;
    onClick: (coordinates: CellCoordinates, parentCellCoordinates: CellCoordinates) => void;
};

export const ChildCell = ({ value, coordinates, parentCellCoordinates, onClick }: ChildCellProps) => (
    <div
        className={styles.container}
        onClick={value ? undefined : () => onClick(parentCellCoordinates, coordinates)}
    >
        {value === CellValueChar.X ? Cross : value === CellValueChar.O ? Circle : null}
    </div>
);
