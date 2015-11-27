import {StepInterface} from "../solver";
import {Board, PresentationBoard, BoardInterface} from "../board";

export class ReplayableBoard implements BoardInterface {
    private _board: PresentationBoard;
    private _startingPositions: Array<number>;
    private _steps: Array<StepInterface>;
    private _nextStepIndex: number;
    private _snapshots: Array<PresentationBoard>;

    constructor(size: number, positions: Array<number> = [], steps: Array<StepInterface> = []) {
        this._board = new PresentationBoard(new Board(size, positions));
        this._startingPositions = positions.slice();
        this._steps = steps;
        this._nextStepIndex = 0;
        this._snapshots = [];
        this.forward();
    }

    get size(): number {
        return this._board.size;
    }

    get positions(): Array<number> {
        return this._board.positions;
    }

    get progress(): number {
        return Math.floor(this._nextStepIndex / this._steps.length * 10000) / 100;
    }

    isSafe(column: number, row: number): boolean {
        return this._board.isSafe(column, row);
    }

    isTaken(column: number): boolean {
        return this._board.isTaken(column);
    }

    isQueenPlacedAt(column: number, row: number): boolean {
        return this._board.isQueenPlacedAt(column, row);
    }

    isQueenPlacedByUser(column: number, row: number): boolean {
        return this._startingPositions[column] === row;
    }

    isFocused(column: number): boolean {
        return this._board.isFocused(column);
    }

    isCellVisited(column: number, row: number): boolean {
        return this._board.visitedCells.isVisited(column, row);
    }

    get columnTextIndex(): number {
        return this._board.columnTextIndex;
    }

    textForRow(row: number): string {
        return this._board.textForRow(row);
    }

    canBackward(): boolean {
        return this._nextStepIndex > 1;
    }

    canForward(): boolean {
        return this._nextStepIndex !== this._steps.length;
    }

    fastBackward(): void {
        while (this.backward());
    }

    backward(): boolean {
        if (!this.canBackward()) {
            return false;
        }

        this._board = this._snapshots.pop();

        this._nextStepIndex--;
        return true;
    }

    forward(): boolean {
        if (!this.canForward()) {
            return false;
        }

        this._snapshots.push(this._board.clone());

        var step = this._steps[this._nextStepIndex];
        step.apply(this._board);

        this._nextStepIndex++;
        return true;
    }

    fastForward(): void {
        while (this.forward());
    }

    placeQueen(column: number, row: number): void {
        throw new Error("Cannot place queen directly on a replayable board");
    }

    removeQueen(column: number): void {
        throw new Error("Cannot remove queen directly from a replayable board");
    }
}
