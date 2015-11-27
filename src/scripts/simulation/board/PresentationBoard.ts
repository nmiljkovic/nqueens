import {Board, BoardDecorator} from "./Board";

export class PresentationBoard extends BoardDecorator {
    constructor(_board: Board, private _focusedColumn: number = 0,
        private _visitedCells: VisitedCellCollection = new VisitedCellCollection(),
        private _columnTextIndex: number = -1, private _columnText: Array<string> = []) {
        super(_board);
    }

    clone(): PresentationBoard {
        return new PresentationBoard(
            this._board.clone(),
            this._focusedColumn,
            this._visitedCells.clone(),
            this._columnTextIndex,
            this._columnText.slice()
        );
    }

    get focusedColumn(): number {
        return this._focusedColumn;
    }

    get visitedCells(): VisitedCellCollection {
        return this._visitedCells;
    }

    get columnTextIndex(): number {
        return this._columnTextIndex;
    }

    textForRow(row: number): string {
        return this._columnText[row];
    }

    isFocused(column: number): boolean {
        return column === this.focusedColumn;
    }

    focusColumn(column: number): void {
        this._focusedColumn = column;
    }

    markVisited(column: number, row: number): void {
        this._visitedCells.markVisited(column, row);
    }

    clearVisitedColumn(column: number): void {
        this._visitedCells.clearColumn(column);
    }

    setCurrentColumnTextIndex(column: number): void {
        this._columnTextIndex = column;
        this._columnText = new Array(this._board.size);
    }

    setRowText(row: number, text: string): void {
        this._columnText[row] = text;
    }
}

class VisitedCellCollection {
    constructor(private _cells: Map<number, Map<number, boolean>> = new Map<number, Map<number, boolean>>()) {
    }

    clone(): VisitedCellCollection {
        let clonedCells = new Map<number, Map<number, boolean>>();
        this._cells.forEach((rows: Map<number, boolean>, column: number) => {
            let clonedRows = new Map<number, boolean>();
            rows.forEach((value, row) => clonedRows.set(row, value));
            clonedCells.set(column, clonedRows);
        });

        return new VisitedCellCollection(clonedCells);
    }

    isVisited(column: number, row: number): boolean {
        if (!this._cells.has(column)) {
            return false;
        }

        return this._cells.get(column).has(row);
    }

    markVisited(column: number, row: number): void {
        if (!this._cells.has(column)) {
            this._cells.set(column, new Map<number, boolean>());
        }

        this._cells.get(column).set(row, true);
    }

    clearColumn(column: number): void {
        this._cells.delete(column);
    }
}
