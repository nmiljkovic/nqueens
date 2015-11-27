import {Component} from "angular2/angular2";

@Component({
    selector: 'sidebar-square-legend',
    host: {
        'style': 'display: block;'
    },
    template: `
<h4>Square colors</h4>

<div class="ui middle aligned list legend">
  <div class="item">
    <div class="ui avatar image focused-column"></div>
    <div class="content">
      <div class="header">Next move</div>
    </div>
  </div>
  <div class="item">
    <div class="ui avatar image unsafe"></div>
    <div class="content">
      <div class="header">Unsafe - queen cannot be placed here</div>
    </div>
  </div>
  <div class="item">
    <div class="ui avatar image visited"></div>
    <div class="content">
      <div class="header">Visited and not a part of the solution</div>
    </div>
  </div>
  <div class="item">
    <div class="ui avatar image user-placed"></div>
    <div class="content">
      <div class="header">Placed by you!</div>
    </div>
  </div>
</div>
    `
})
export class SquareLegendComponent {

}
