import {Component, Input} from "angular2/angular2";
import {BoardComponent} from "./board";
import {SidebarComponent} from "./sidebar";
import {Simulation} from "../simulation";

@Component({
    selector: 'app',
    host: {
        'style': 'display: block;'
    },
    template: `
<div class="ui container">
    <div class="ui grid">
        <div class="sixteen wide column">
            <h2>NQueens interactive solver</h2>
        </div>
    </div>
</div>
<div class="ui two column grid container">
    <board class="board eleven wide column"></board>
    <sidebar class="five wide column"></sidebar>
</div>
    `,
    directives: [BoardComponent, SidebarComponent],
})
export class AppComponent {
    constructor() {
    }
}
