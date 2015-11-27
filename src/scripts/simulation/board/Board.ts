export interface BoardInterface {
    size: number;
    positions: Array<number>;
    isTaken(column: number): boolean;
    isSafe(column: number, row: number): boolean;
    isQueenPlacedAt(column: number, row: number): boolean;
    isQueenPlacedByUser(column: number, row: number): boolean;
    isCellVisited(column: number, row: number): boolean;
    placeQueen(column: number, row: number): void;
    removeQueen(column: number): void;
}

export class Board implements BoardInterface {
    static get free() {
        return -1;
    }

    private _size: number;

    // An array representing queen positions.
    //
    // positions[column] is a number of the row where the queen is located,
    // or -1 if no queens are placed on that column
    private _positions: Array<number>;

    constructor(size: number, positions: Array<number> = []) {
        if (size <= 3) {
            throw new Error("Board size must be at least 4 columns wide");
        }

        if (positions.length !== size && positions.length !== 0) {
            throw new Error("Positions must have " + size + " columns");
        }

        this._size = size;
        if (positions.length) {
            this._positions = positions;
        } else {
            this.reset();
        }
    }

    clone(): Board {
        return new Board(this.size, this.positions);
    }

    get size(): number {
        return this._size;
    }

    get positions(): Array<number> {
        return this._positions.slice();
    }

    reset(): void {
        this._positions = [];
        for (let i = 0; i < this.size; i++) {
            this._positions.push(Board.free);
        }
    }

    isTaken(column: number): boolean {
        if (column < 0 || column > this.size) {
            throw new Error("Column out of bounds");
        }
        return this._positions[column] !== Board.free;
    }

    isSafe(column: number, row: number): boolean {
        if (this._positions[column] !== Board.free) {
            return false;
        }

        return _.every(this._positions, (queenRow, currentColumnIndex) => {
            if (queenRow === Board.free) {
                return true;
            }

            // skip column being queried
            if (currentColumnIndex === column) {
                return true;
            }

            // The below formula does not cover same row cases
            if (queenRow === row) {
                return false;
            }

            return (Math.abs(currentColumnIndex - column) !== Math.abs(row - queenRow));
        });
    }

    isQueenPlacedAt(column: number, row: number): boolean {
        return this._positions[column] === row;
    }

    isCellVisited(column: number, row: number): boolean {
        return false;
    }

    isQueenPlacedByUser(column: number, row: number): boolean {
        return false;
    }

    placeQueen(column: number, row: number): void {
        if (row < 0 || row >= this.size || column < 0 || column >= this.size) {
            throw new Error("Queen out of bounds");
        }

        if (this.positions[column] !== Board.free) {
            throw new Error("Queen cannot be placed on " + column + " as there is a queen placed on the same column - remove it first");
        }

        this._positions[column] = row;
    }

    removeQueen(column: number): void {
        if (column < 0 || column > this.size) {
            throw new Error("Column out of bounds");
        }

        this._positions[column] = Board.free;
    }
}

export class BoardDecorator implements BoardInterface {
    constructor(protected _board: Board) {
    }

    get size(): number {
        return this._board.size;
    }

    get positions(): Array<number> {
        return this._board.positions;
    }

    isTaken(column: number): boolean {
        return this._board.isTaken(column);
    }

    isSafe(column: number, row: number): boolean {
        return this._board.isSafe(column, row);
    }

    isQueenPlacedAt(column: number, row: number): boolean {
        return this._board.isQueenPlacedAt(column, row);
    }

    isQueenPlacedByUser(column: number, row: number): boolean {
        return this._board.isQueenPlacedByUser(column, row);
    }

    isCellVisited(column: number, row: number): boolean {
        return this._board.isCellVisited(column, row);
    }

    placeQueen(column: number, row: number): void {
        this._board.placeQueen(column, row);
    }

    removeQueen(column: number): void {
        this._board.removeQueen(column);
    }
}
