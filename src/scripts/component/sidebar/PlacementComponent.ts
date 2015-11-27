import {Component, NgIf} from "angular2/angular2";
import {Simulation, BoardEditor} from "../../simulation";

@Component({
    selector: 'sidebar-placement',
    directives: [NgIf],
    host: {
        'style': 'display: block;'
    },
    template: `
<h3>Queen Placement</h3>

<p>{{ text }}</p>

<button class="ui fluid primary button" (click)="editor.startEditingBoard()" *ng-if="!editor.editing"
    [disabled]="!supportsUserPlacement">
    <i class="grid layout icon"></i>
    Enter placement mode
</button>
<button class="ui fluid primary button" (click)="editor.finishEditingBoard()" *ng-if="editor.editing">
    <i class="grid layout icon"></i>
    Solve board
</button>
    `
})
export class PlacementComponent {
    constructor(public simulation: Simulation, public editor: BoardEditor) {
    }

    get supportsUserPlacement(): boolean {
        return this.simulation.selectedSolver.supportsUserPlacement;
    }

    get text(): string {
        if (!this.supportsUserPlacement) {
            return "The selected solver does not support pre-placed queens.";
        }

        return "You can manually place queens on the board and the algorithm will try and find a solution.";
    }
}
