import {SolverUtil} from "./SolverUtil";
import {PresentationBoard, RecordableBoard, BoardInterface} from "../board";

export interface StepInterface {
    apply(board: PresentationBoard): void;
}

export class QueenPlacementStep implements StepInterface {
    constructor(private _column: number, private _row: number) {
    }

    get column(): number {
        return this._column;
    }

    get row(): number {
        return this._row;
    }

    apply(board: PresentationBoard): void {
        board.removeQueen(this._column);
        board.placeQueen(this._column, this._row);
    }
}

export class QueenRemovalStep implements StepInterface {
    constructor(private _column: number) {
    }

    get column(): number {
        return this._column;
    }

    apply(board: PresentationBoard): void {
        board.removeQueen(this._column);
    }
}

export class FocusColumnStep implements StepInterface {
    constructor(private _column: number) {
    }

    get column(): number {
        return this._column;
    }

    apply(board: PresentationBoard): void {
        board.focusColumn(this._column);
    }
}

export class MarkVisitedStep implements StepInterface {
    constructor(private _column: number, private _row: number) {
    }

    apply(board: PresentationBoard): void {
        board.markVisited(this._column, this._row);
    }
}

export class ClearVisitedColumnStep implements StepInterface {
    constructor(private _column: number) {
    }

    apply(board: PresentationBoard): void {
        board.clearVisitedColumn(this._column);
    }
}

export class SetColumnHeuristicText implements StepInterface {
    constructor(private _column: number, private _text: Array<string>) {
    }

    apply(board: PresentationBoard): void {
        board.setCurrentColumnTextIndex(this._column);
        this._text.forEach((text, row) => board.setRowText(row, text));
    }
}

export class MultiStep implements StepInterface {
    constructor(private _steps: Array<StepInterface>) {
    }

    apply(board: PresentationBoard): void {
        this._steps.forEach((step: StepInterface) => {
            step.apply(board);
        });
    }
}

export class StepBuilder {
    private _steps: Array<StepInterface> = [];

    placeQueen(column: number, row: number): StepBuilder {
        this._steps.push(new QueenPlacementStep(column, row));
        return this;
    }

    removeQueen(column: number): StepBuilder {
        this._steps.push(new QueenRemovalStep(column));
        return this;
    }

    focusColumn(column: number): StepBuilder {
        this._steps.push(new FocusColumnStep(column));
        return this;
    }

    markVisited(column: number, row: number): StepBuilder {
        this._steps.push(new MarkVisitedStep(column, row));
        return this;
    }

    clearVisitedColumn(column: number): StepBuilder {
        this._steps.push(new ClearVisitedColumnStep(column));
        return this;
    }

    setMinConflictColumnText(board: BoardInterface, column: number): StepBuilder {
        let text: Array<string> = _.chain(board.size)
            .range()
            .map((row) => String(SolverUtil.calculateCellConflicts(board, column, row)))
            .value();

        this._steps.push(new SetColumnHeuristicText(column, text));
        return this;
    }

    setHillClimbingHeuristicText(board: BoardInterface, column: number, heuristicFn: CellHeuristicFn): StepBuilder {
        let text: Array<string> = _.chain(board.size)
            .range()
            .map((row) => {
                if (board.isSafe(column, row)) {
                    return String(heuristicFn(board, column, row));
                }

                return '';
            })
            .value();

        this._steps.push(new SetColumnHeuristicText(column, text));
        return this;
    }

    static create(): StepBuilder {
        return new StepBuilder();
    }

    get(): StepInterface {
        return new MultiStep(this._steps);
    }
}

interface CellHeuristicFn {
    (board: BoardInterface, column: number, row: number): number;
}
