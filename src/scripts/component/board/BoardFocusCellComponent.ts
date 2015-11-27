import {Component, Input} from "angular2/angular2";
import {ReplayableBoard, Simulation, BoardEditor} from "../../simulation";

@Component({
    selector: 'queens-board-focus-cell',
    host: {
        '[class.focused]': 'isFocused(column)',
        '[class.board-focus-cell]': 'true'
    },
    template: ``
})
export class BoardFocusCellComponent {
    @Input() column: number;

    constructor(private _simulation:Simulation, private _editor:BoardEditor) {
    }

    isFocused(column:number):boolean {
        return this._simulation.board.isFocused(column) && !this._editor.editing;
    }
}
