import {Component, Input, NgIf} from "angular2/angular2";
import {BoardInterface, Board, ReplayableBoard, Simulation, BoardEditor} from "../../simulation";

@Component({
    selector: 'queens-board-cell',
    host: {
        '[class.unsafe]': '!isSafe() && !hasQueenPlaced()',
        '[class.visited]': 'isVisited()',
        '[class.queen]': 'hasQueenPlaced()',
        '[class.user-placed]': 'isUserPlaced()',
        '(click)': 'toggleQueen()'
    },
    directives: [NgIf],
    template: `
<span *ng-if="board.columnTextIndex === column">{{ board.textForRow(row) }}</span>
    `
})
export class BoardCellComponent {
    @Input() column: number;
    @Input() row: number;

    constructor(private _simulation: Simulation, private _editor: BoardEditor) {
    }

    toggleQueen(): void {
        if (!this.editing) {
            return;
        }

        if (this.hasQueenPlaced()) {
            this.board.removeQueen(this.column);
        } else if (this.isSafe()) {
            this.board.placeQueen(this.column, this.row);
        }
    }

    private get board(): BoardInterface {
        if (this.editing) {
            return this._editor.board;
        } else {
            return this._simulation.board;
        }
    }

    private get editing(): boolean {
        return this._editor.editing;
    }

    isSafe(): boolean {
        return this.board.isSafe(this.column, this.row);
    }

    isVisited(): boolean {
        return this.board.isCellVisited(this.column, this.row);
    }

    hasQueenPlaced(): boolean {
        return this.board.isQueenPlacedAt(this.column, this.row);
    }

    isUserPlaced(): boolean {
        return this.board.isQueenPlacedByUser(this.column, this.row);
    }
}
