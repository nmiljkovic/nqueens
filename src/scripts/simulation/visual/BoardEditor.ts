import {Injectable} from "angular2/angular2";
import {Simulation} from "./Simulation";
import {Board, BoardInterface} from "../board";

@Injectable()
export class BoardEditor {
    private _board: Board;
    private _boardCopy: Board;
    private _editing: boolean;

    constructor(private _simulation: Simulation) {
        this._board = new Board(_simulation.boardSize);
    }

    get board(): Board {
        return this._board;
    }

    get editing(): boolean {
        return this._editing;
    }

    startEditingBoard(): void {
        this._editing = true;
        if (this._simulation.boardSize !== this._board.size) {
            this._board = new Board(this._simulation.boardSize);
        }
        this._boardCopy = this._board.clone();
    }

    finishEditingBoard(): void {
        this._editing = false;
        this._simulation.setStartingBoard(this._board.clone());
    }

    cancelEditingBoard(): void {
        this._editing = false;
        this._board = this._boardCopy;
    }
}
