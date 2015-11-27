import {StepInterface} from "./Step";

export class Solution {
    constructor(private _solved: boolean, private _steps: Array<StepInterface>) {
    }

    get solved(): boolean {
        return this._solved;
    }

    get steps(): Array<StepInterface> {
        return this._steps;
    }
}
