import { Cross } from '@/CellValues/Cross.tsx';
import { Circle } from '@/CellValues/Circle.tsx';
import { ChildCell } from '@/ChildCell/ChildCell.tsx';
import styles from './ParentCell.module.scss';
import { CellValueChar } from '@/constants.ts';
import { clsx } from 'clsx';
import { CellCoordinates, ParentCellDefinition } from '@/types.ts';

export type ParentCellProps = {
    definition: ParentCellDefinition;
    coordinates: CellCoordinates;
    onChildCellClick: (coordinates: CellCoordinates, parentCellCoordinates: CellCoordinates) => void;
    disabled: boolean;
};

export const ParentCell = ({ definition, coordinates, onChildCellClick, disabled }: ParentCellProps) => (
    <div className={clsx(styles.container, disabled && styles.containerDisabled)}>
        <div className={styles.field}>
            {definition.field.map((childRow, childRowIndex) =>
                childRow.map((childCell, childColumnIndex) => (
                    <ChildCell
                        key={`${childRowIndex}-${childColumnIndex}`}
                        value={childCell.value}
                        coordinates={{
                            row: childRowIndex,
                            column: childColumnIndex
                        }}
                        parentCellCoordinates={{
                            row: coordinates.row,
                            column: coordinates.column
                        }}
                        onClick={onChildCellClick}
                    />
                ))
            )}
        </div>
        {definition.value && (
            <div className={styles.value}>{definition.value === CellValueChar.X ? Cross : Circle}</div>
        )}
    </div>
);
