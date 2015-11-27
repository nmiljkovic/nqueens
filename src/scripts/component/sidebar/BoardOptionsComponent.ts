import {Component, Input, NgFor, NgModel} from "angular2/angular2";
import {Range} from "../../pipes";
import {Simulation, VisualOptions} from "../../simulation";
import {DepthFirstSearchSolver, MinConflictSolver, HillClimbingSolver, SolverInterface} from "../../simulation";

@Component({
    selector: 'sidebar-board-options',
    directives: [NgFor, NgModel],
    pipes: [Range],
    host: {
        'style': 'display: block;'
    },
    template: `
<h4>Board size</h4>

<div class="ui fluid small blue buttons">
    <button class="ui button" *ng-for="#size of 11 | range:4"
        [class.active]="simulation.boardSize === size" (click)="setBoardSize(size)">
        {{ size }}
    </button>
</div>

<h4>Animation speed</h4>

<div class="ui fluid small buttons">
    <button class="ui button" *ng-for="#animationSpeed of animationSpeeds"
        [class.active]="visualOptions.animationSpeed === animationSpeed.speed" (click)="setAnimationSpeed(animationSpeed.speed)">
        {{ animationSpeed.label }}
    </button>
</div>

<h4>Solver</h4>

<select class="ui fluid dropdown" (ng-model-change)="changeSolver()" [(ng-model)]="selectedSolver">
  <option *ng-for="#solver of solvers" [value]="solver.displayName">{{ solver.displayName }}</option>
</select>

<h4>Visual options</h4>

<div class="ui form">
    <div class="grouped-fields">
        <div class="field">
            <div class="ui checkbox">
              <input type="checkbox" id="checkbox_fade_squares" [(ng-model)]="visualOptions.fadeSquares">
              <label for="checkbox_fade_squares">Fade squares</label>
            </div>
        </div>
        <div class="field">
            <div class="ui checkbox">
              <input type="checkbox" id="checkbox_show_unsafe" [(ng-model)]="visualOptions.showUnsafeSquares">
              <label for="checkbox_show_unsafe">Show unsafe squares</label>
            </div>
        </div>
        <div class="field">
            <div class="ui checkbox">
              <input type="checkbox" id="checkbox_show_visited" [(ng-model)]="visualOptions.showVisitedSquares">
              <label for="checkbox_show_visited">Show visited squares</label>
            </div>
        </div>
    </div>
</div>
    `
})
export class BoardOptionsComponent {
    animationSpeeds = [
        {
            label: 'Slow',
            speed: 2000
        },
        {
            label: 'Normal',
            speed: 1000
        },
        {
            label: 'Fast',
            speed: 250
        },
        {
            label: 'Very Fast',
            speed: 100
        }
    ];

    solvers: Array<SolverInterface> = [
        new DepthFirstSearchSolver(),
        new MinConflictSolver(),
        new HillClimbingSolver(),
    ];

    selectedSolver: string;

    constructor(public simulation: Simulation, public visualOptions: VisualOptions) {
        this.selectedSolver = simulation.selectedSolver.displayName;
    }

    setBoardSize(size: number): void {
        this.simulation.changeBoardSize(size);
    }

    setAnimationSpeed(speed: number): void {
        this.visualOptions.animationSpeed = speed;
    }

    changeSolver(): void {
        let solver = _.find(this.solvers, (solver) => {
            return solver.displayName === this.selectedSolver;
        });

        this.simulation.changeSolver(solver);
    }
}
