import { FIELD_SIZE } from '@/constants.ts';
import { ParentCell } from '@/ParentCell/ParentCell.tsx';
import { CellCoordinates, CellCoordinatesStringRepresentation, Field } from '@/types.ts';
import styles from './GameField.module.scss';

export type FieldProps = {
    field: Field;
    onChildCellClick: (parentCellCoordinates: CellCoordinates, childCellCoordinates: CellCoordinates) => void;
    parentCellsAvailableForMove: Set<CellCoordinatesStringRepresentation>;
};

export const GameField = ({ field, onChildCellClick, parentCellsAvailableForMove }: FieldProps) => (
    <div
        className={styles.field}
        style={{
            '--field-size-cells': FIELD_SIZE
        }}
    >
        {field.map((row, rowIndex) =>
            row.map((cell, columnIndex) => (
                <ParentCell
                    key={`${rowIndex}-${columnIndex}`}
                    definition={cell}
                    coordinates={{
                        row: rowIndex,
                        column: columnIndex
                    }}
                    onChildCellClick={onChildCellClick}
                    disabled={!parentCellsAvailableForMove.has(`${rowIndex}-${columnIndex}`)}
                />
            ))
        )}
    </div>
);
