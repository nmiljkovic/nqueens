import {SolverInterface} from "./SolverInterface";
import {Solution} from "./Solution";
import {SolverUtil} from "./SolverUtil";
import {StepBuilder} from "./Step";
import {BoardInterface, Board, RecordableBoard} from "../board";

interface CellInterface {
    column: number;
    row: number;
}

interface CellConflictInterface extends CellInterface {
    conflicts: number;
}

function pickRandomColumn(board: BoardInterface): number {
    return Math.floor(Math.random() * board.size);
}

export class MinConflictSolver implements SolverInterface {
    get displayName(): string {
        return "Min Conflict";
    }

    get supportsUserPlacement(): boolean {
        return false;
    }

    /**
     * Calculates the optimal queen row for a given column.
     * An optimal queen cell is the cell with the minimum number of queens attacking that cell.
     * If more than 1 cells have the same minimum amount of attacking pieces, a random cell is chosen.
     *
     * If the queen is already on the optimal row, that row is returned.
     */
    private calculateOptimalQueenRow(board: BoardInterface, column: number): number {
        let currentPlacement = board.positions[column];
        let currentColumnCells = _.map(_.range(board.size), (row: number): CellConflictInterface => {
            return {
                row: row,
                column: column,
                conflicts: SolverUtil.calculateCellConflicts(board, column, row)
            };
        })

        // Pick the minimum conflict cell
        let minConflicts: number = _.min(currentColumnCells, (cell) => cell.conflicts).conflicts;

        let choices = _.chain(currentColumnCells)
            // Only select minimum conflict cells
            .filter((cell) => minConflicts === cell.conflicts)
            // Avoid current placement
            .reject((cell) => cell.row === currentPlacement)
            .map((cell) => cell.row)
            .shuffle()
            .value();

        return choices.length ? _.first(choices) : currentPlacement;
    }

    /**
     * Chooses a random column based on the conflicts with the current column.
     *
     * If no conflicts are available, returns SolverUtil.noColumn
     */
    private pickRandomConflictColumn(board: BoardInterface, currentColumn: number): number {
        let currentRow = board.positions[currentColumn];

        let horizontalChoices = _.chain(board.positions)
            .map((row, column): CellInterface => {
                return { row: row, column: column };
            })
            .reject(position => position.column === currentColumn)
            .filter(position => position.row === currentRow)
            .value();

        let diagonalChoices = _.chain(board.positions)
            .map((row, column): CellInterface => {
                return { row: row, column: column };
            })
            .reject(position => position.column === currentColumn)
            .filter(position => {
                return Math.abs(currentColumn - position.column) === Math.abs(currentRow - position.row);
            })
            .value();

        let choices = horizontalChoices.concat(diagonalChoices);

        if (!choices.length) {
            return SolverUtil.noColumn;
        }

        let choice = _.sample(choices);
        return choice.column;
    }

    private chooseFirstColumn(board: BoardInterface) {
        let currentColumn = SolverUtil.findFirstEmptyColumn(board);
        if (currentColumn !== SolverUtil.noColumn) {
            return currentColumn;
        }

        return pickRandomColumn(board);
    }

    private chooseNextColumn(board: BoardInterface, currentColumn: number): number {
        let nextColumn = SolverUtil.findFirstEmptyColumn(board);
        if (nextColumn !== SolverUtil.noColumn) {
            return nextColumn;
        }

        nextColumn = this.pickRandomConflictColumn(board, currentColumn);

        if (nextColumn === SolverUtil.noColumn && !SolverUtil.isSolved(board)) {
            nextColumn = pickRandomColumn(board);
        }

        return nextColumn;
    }

    private minConflict(board: RecordableBoard): boolean {
        if (SolverUtil.isSolved(board)) {
            return true;
        }

        let iterations = 0;
        let currentColumn = SolverUtil.findFirstEmptyColumn(board);
        if (currentColumn === SolverUtil.noColumn) {
            currentColumn = pickRandomColumn(board);
        }

        board.addStep(StepBuilder.create()
            .focusColumn(currentColumn)
            .setMinConflictColumnText(board, currentColumn)
            .get()
        );

        do {
            iterations++;

            let row = this.calculateOptimalQueenRow(board, currentColumn);

            board.removeQueen(currentColumn);
            board.placeQueen(currentColumn, row);

            let nextColumn = this.chooseNextColumn(board, currentColumn);

            board.addStep(StepBuilder.create()
                .placeQueen(currentColumn, row)
                .focusColumn(nextColumn)
                .setMinConflictColumnText(board, nextColumn)
                .get()
            );

            currentColumn = nextColumn;
        } while (iterations < 100 && !SolverUtil.isSolved(board));

        return SolverUtil.isSolved(board);
    }

    solve(startingBoard: BoardInterface): Solution {
        let board = new RecordableBoard(startingBoard.size, startingBoard.positions);
        let solved = this.minConflict(board);

        return new Solution(solved, board.steps);
    }
}
