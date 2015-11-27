import {Pipe} from "angular2/angular2";

/**
 * Creates an array of integers.
 * Usage:
 *
 * ```
 * 	5|range   - creates an array from 0-4 (inclusive)
 * 	5|range:2 - creates an array from 2-4 (inclusive)
 * ```
 */
@Pipe({
    name: 'range'
})
export class Range {
    transform(value: number, [start]): any {
        if (!start) {
            start = 0;
        }

        let result: Array<number> = [];
        for (let i = start; i < value; i++) {
            result.push(i);
        }
        return result;
    }
}
