import {SolverInterface} from "./SolverInterface";
import {Solution} from "./Solution";
import {SolverUtil} from "./SolverUtil";
import {StepBuilder} from "./Step";
import {BoardInterface, RecordableBoard} from "../board";

function diag(size: number, column: number, row: number): number {
    ++row;
    ++column;
    return Math.max(
        row + column + 1,
        2 * size - row - column + 1
    );
}

function heuristic(board: BoardInterface, column: number, row: number): number {
    return board.size * diag(board.size, column, row) + column;
}

export class HillClimbingSolver implements SolverInterface {
    get displayName(): string {
        return "Hill Climbing";
    }

    get supportsUserPlacement(): boolean {
        return true;
    }

    private hillclimb(board: RecordableBoard, column: number): boolean {
        if (column === SolverUtil.noColumn) {
            return true;
        }

        let choices = _.chain(_.range(board.size))
            .filter((row) => board.isSafe(column, row))
            .map((row) => {
                return {
                    column: column,
                    row: row,
                    heuristic: heuristic(board, column, row)
                };
            })
            .sortBy((cell) => cell.heuristic)
            .value();

        return _.any(choices, (cell) => {
            let row = cell.row;
            board.placeQueen(column, row);

            let nextColumn = SolverUtil.findFirstEmptyColumn(board);
            board.addStep(StepBuilder.create()
                .placeQueen(column, row)
                .focusColumn(nextColumn)
                .setHillClimbingHeuristicText(board, nextColumn, heuristic)
                .get()
            );

            if (this.hillclimb(board, nextColumn)) {
                return true;
            }

            board.removeQueen(column);
            board.addStep(StepBuilder.create()
                .removeQueen(column)
                .clearVisitedColumn(nextColumn)
                .markVisited(column, row)
                .focusColumn(column)
                .setHillClimbingHeuristicText(board, column, heuristic)
                .get()
            );

            return false;
        });
    }

    solve(startingBoard: BoardInterface): Solution {
        let board: RecordableBoard = new RecordableBoard(startingBoard.size, startingBoard.positions);
        let firstColumn = SolverUtil.findFirstEmptyColumn(board);

        board.addStep(StepBuilder.create()
            .focusColumn(firstColumn)
            .setHillClimbingHeuristicText(board, firstColumn, heuristic)
            .get()
        );

        let solved: boolean = this.hillclimb(board, firstColumn);

        return new Solution(solved, board.steps);
    }
}
