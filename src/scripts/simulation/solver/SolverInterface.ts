import {Solution} from "./Solution";
import {BoardInterface} from "../board";

export interface SolverInterface {
    displayName: string;
    supportsUserPlacement: boolean;
    solve(board: BoardInterface): Solution;
}
