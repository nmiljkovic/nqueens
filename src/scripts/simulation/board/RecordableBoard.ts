import {StepInterface} from "../solver";
import {Board, BoardDecorator} from "./Board";

export class RecordableBoard extends Board {
    private _steps: Array<StepInterface>;
    private _startingPositions: Array<number>;

    constructor(size: number, positions: Array<number>) {
        super(size, positions);
        this._steps = [];
        this._startingPositions = positions.slice();
    }

    get steps(): Array<StepInterface> {
        return this._steps;
    }

    isQueenPlacedByUser(column: number, row: number): boolean {
        return this.isQueenPlacedAt(column, row) && this._startingPositions[column] === row;
    }

    addStep(step: StepInterface): void {
        this._steps.push(step);
    }
}
