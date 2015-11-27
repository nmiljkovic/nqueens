import {SolverInterface, StepBuilder, Solution, SolverUtil} from "../solver";
import {Board, BoardInterface, RecordableBoard} from "../board";

export class DepthFirstSearchSolver implements SolverInterface {
    get displayName(): string {
        return "Depth First Search";
    }

    get supportsUserPlacement(): boolean {
        return true;
    }

    private dfs(board: RecordableBoard, column: number): boolean {
        return _.chain(_.range(board.size))
            .filter((row: number) => board.isSafe(column, row))
            .any((row: number) => {
                board.placeQueen(column, row);

                var nextColumn = SolverUtil.findFirstEmptyColumn(board);
                board.addStep(StepBuilder.create()
                    .placeQueen(column, row)
                    .focusColumn(nextColumn)
                    .get()
                );

                if (nextColumn === SolverUtil.noColumn) {
                    return SolverUtil.isSolved(board);
                }

                if (this.dfs(board, nextColumn)) {
                    return true;
                }

                board.removeQueen(column);
                board.addStep(StepBuilder.create()
                    .removeQueen(column)
                    .focusColumn(column)
                    .markVisited(column, row)
                    .clearVisitedColumn(nextColumn)
                    .get()
                );

                return false;
            })
            .value();
    }

    solve(startingBoard: BoardInterface): Solution {
        var board: RecordableBoard = new RecordableBoard(startingBoard.size, startingBoard.positions);
        var startingColumn = SolverUtil.findFirstEmptyColumn(board);

        if (startingColumn === SolverUtil.noColumn) {
            return new Solution(SolverUtil.isSolved(board), []);
        }

        board.addStep(StepBuilder.create()
            .focusColumn(startingColumn)
            .get()
        );
        let solved: boolean = this.dfs(board, startingColumn);

        return new Solution(solved, board.steps);
    }
}
