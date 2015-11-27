import {Component, Input, Inject, CORE_DIRECTIVES} from "angular2/angular2";
import {BoardFocusCellComponent} from "./BoardFocusCellComponent";
import {BoardCellComponent} from "./BoardCellComponent";
import {Board, Simulation, BoardEditor, VisualOptions} from "../../simulation";
import {Range} from "../../pipes";

@Component({
    selector: 'board',
    pipes: [Range],
    directives: [CORE_DIRECTIVES, BoardFocusCellComponent, BoardCellComponent],
    host: {
        '[class.fade-squares]': 'visualOptions.fadeSquares',
        '[class.show-unsafe-squares]': 'visualOptions.showUnsafeSquares',
        '[class.show-visited-squares]': 'visualOptions.showVisitedSquares',
        '[class.editing]': 'editor.editing',
    },
    template: `
<div class="board-focus-row">
    <queens-board-focus-cell *ng-for="#column of simulation.boardSize | range"
        [column]="column">
    </queens-board-focus-cell>
</div>
<div class="board-cells">
    <div *ng-for="#row of simulation.boardSize | range" class="board-row">
        <queens-board-cell *ng-for="#column of simulation.boardSize | range"
            [column]="column" [row]="row" class="board-cell">
        </queens-board-cell>
    </div>
</div>
    `,
})
export class BoardComponent {
    constructor(public simulation: Simulation, public editor:BoardEditor, public visualOptions: VisualOptions) {
    }
}
