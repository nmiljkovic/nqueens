import {BoardInterface, Board} from "../board";

export class SolverUtil {
    static get noColumn(): number {
        return -1;
    }

    /**
     * Returns the index of the first empty column,
     * or SolverUtil.noColumn if all columns are occupied
     */
    static findFirstEmptyColumn(board: BoardInterface): number {
        return SolverUtil.findNextColumn(board, this.noColumn);
    }

    /**
     * Returns the first empty column, starting from startColumn,
     * or SolverUtil.noColumn if all columns are occupied
     */
    static findNextColumn(board: BoardInterface, startColumn: number): number {
        for (var column = startColumn + 1; column < board.size; column++) {
            if (!board.isTaken(column)) {
                return column;
            }
        }

        return this.noColumn;
    }

    /**
     * Calculate the number of conflicting cells with the supplied cell.
     */
    static calculateCellConflicts(board: BoardInterface, cellColumn: number, cellRow: number): number {
        return _.reduce(board.positions, (conflicts: number, row: number, column: number) => {
            // skip current column
            if (column === cellColumn) {
                return conflicts;
            }

            if (row === Board.free) {
                return conflicts;
            }

            // check if the cells have the same row
            if (row === cellRow) {
                return conflicts + 1;
            }

            let diagonalMatch = Math.abs(cellColumn - column) === Math.abs(cellRow - row);
            return diagonalMatch ? conflicts + 1 : conflicts;
        }, 0);
    }

    /**
     * Returns true if the board has a valid solution.
     */
    static isSolved(board: BoardInterface): boolean {
        return _.all(board.positions, (row: number, column: number) => {
            if (row === Board.free) {
                return false;
            }

            return this.calculateCellConflicts(board, column, row) === 0;
        });
    }
}
