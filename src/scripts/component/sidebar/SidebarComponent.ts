import {Component, NgFor, NgIf} from "angular2/angular2";
import {ProgressComponent} from "./ProgressComponent";
import {ControlsComponent} from "./ControlsComponent";
import {PlacementComponent} from "./PlacementComponent";
import {BoardOptionsComponent} from "./BoardOptionsComponent";
import {SquareLegendComponent} from "./SquareLegendComponent";
import {Simulation, BoardEditor, VisualOptions} from "../../simulation";

@Component({
    selector: 'sidebar',
    directives: [
        NgIf,
        ControlsComponent, ProgressComponent,
        PlacementComponent,
        BoardOptionsComponent, SquareLegendComponent
    ],
    template: `
<div class="ui grid">
    <sidebar-controls class="sixteen wide column" *ng-if="!editing">
    </sidebar-controls>

    <sidebar-progress class="sixteen wide column" *ng-if="!editing"
        [progress]="simulationProgress">
    </sidebar-progress>

    <div class="sixteen wide column" *ng-if="!solved && !editing">
        <div class="ui yellow message">
            No solutions were found. You can still step through the simulation.
        </div>
    </div>

    <sidebar-placement class="sixteen wide column">
    </sidebar-placement>

    <sidebar-board-options class="sixteen wide column" *ng-if="!editing">
    </sidebar-board-options>

    <sidebar-square-legend class="sixteen wide column" *ng-if="!editing">
    </sidebar-square-legend>
</div>
    `
})
export class SidebarComponent {
    constructor(private _simulation: Simulation, private _editor: BoardEditor) {
    }

    get simulationProgress(): number {
        return this._simulation.board.progress;
    }

    get editing(): boolean {
        return this._editor.editing;
    }

    get solved(): boolean {
        return this._simulation.solved;
    }
}
