import {Injectable} from "angular2/angular2";

@Injectable()
export class VisualOptions {
    fadeSquares: boolean = true;
    showUnsafeSquares: boolean = true;
    showVisitedSquares: boolean = true;
    animationSpeed: number = 1000;
}
