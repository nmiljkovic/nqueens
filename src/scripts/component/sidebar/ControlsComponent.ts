import {Component, NgIf} from "angular2/angular2";
import {Simulation} from "../../simulation";

@Component({
    selector: 'sidebar-controls',
    directives: [NgIf],
    host: {
        'style': 'display: block;'
    },
    template: `
<div class="ui five icon buttons">
    <button class="ui button" [disabled]="!simulation.canBackward()" (click)="simulation.fastBackward()">
        <i class="fast backward icon"></i>
    </button>
    <button class="ui button" [disabled]="!simulation.canBackward()" (click)="simulation.backward()">
        <i class="backward icon"></i>
    </button>
    <button class="ui button" *ng-if="!simulation.playing" (click)="simulation.play()">
        <i class="play icon"></i>
    </button>
    <button class="ui button" *ng-if="simulation.playing" (click)="simulation.pause()">
        <i class="pause icon"></i>
    </button>
    <button class="ui button" [disabled]="!simulation.canForward()" (click)="simulation.forward()">
        <i class="forward icon"></i>
    </button>
    <button class="ui button" [disabled]="!simulation.canForward()" (click)="simulation.fastForward()">
        <i class="fast forward icon"></i>
    </button>
</div>
    `
})
export class ControlsComponent {
    constructor(public simulation: Simulation) {
    }
}
