import {Component, Input} from "angular2/angular2";

@Component({
    selector: 'sidebar-progress',
    host: {
        'style': 'display: block;',
    },
    template: `
<div class="ui purple progress">
    <div class="bar" [attr.style]="'width: ' + progress + '%'"></div>
</div>
    `
})
export class ProgressComponent {
    @Input() progress: number;
}
