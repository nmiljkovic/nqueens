import {Injectable} from "angular2/angular2";
import {BoardEditor} from "./BoardEditor";
import {VisualOptions} from "./VisualOptions";
import {BoardInterface, Board, ReplayableBoard, RecordableBoard} from "../board";
import {DepthFirstSearchSolver, SolverInterface, Solution} from "../solver";

@Injectable()
export class Simulation {
    private _startingBoard: BoardInterface;
    private _board: ReplayableBoard;
    private _solution: Solution;
    private _solver: SolverInterface;
    private _playing: boolean = false;

    constructor(private _visualization: VisualOptions) {
        this._solver = new DepthFirstSearchSolver();
        this.changeBoardSize(6);
    }

    get boardSize(): number {
        return this._startingBoard.size;
    }

    get board(): ReplayableBoard {
        return this._board;
    }

    get solved(): boolean {
        return this._solution.solved;
    }

    get playing(): boolean {
        return this._playing;
    }

    get selectedSolver():SolverInterface {
        return this._solver;
    }

    setStartingBoard(board: BoardInterface): void {
        if (board.size < 4 || board.size > 10) {
            throw new RangeError("The board size must be between 4 and 10.");
        }

        this._startingBoard = board;
        this.solve();
    }

    changeBoardSize(size: number): void {
        if (size < 4 || size > 10) {
            throw new RangeError("The board size must be between 4 and 10.");
        }

        this._startingBoard = new Board(size);
        this.solve();
    }

    changeSolver(solver: SolverInterface): void {
        this._solver = solver;
        if (!this._solver.supportsUserPlacement) {
            this._startingBoard = new Board(this.boardSize);
        }
        this._board = new ReplayableBoard(this.boardSize);
        this.solve();
    }

    solve(): void {
        this.pause();
        this._solution = this._solver.solve(this._startingBoard);
        this._board = new ReplayableBoard(
            this.boardSize,
            this._startingBoard.positions,
            this._solution.steps.slice()
        );
    }

    canBackward(): boolean {
        return this.board.canBackward();
    }

    canForward(): boolean {
        return this.board.canForward();
    }

    fastBackward(): void {
        this.board.fastBackward();
        this.pause();
    }

    backward(): void {
        this.board.backward();
        this.pause();
    }

    play(): void {
        this._playing = true;
        this.scheduleTick();
    }

    pause(): void {
        this._playing = false;
    }

    forward(): void {
        this.board.forward();
        this.pause();
    }

    fastForward(): void {
        this.board.fastForward();
        this.pause();
    }

    private scheduleTick() {
        setTimeout(() => this.tick(), this._visualization.animationSpeed);
    }

    private tick(): void {
        if (!this.playing) {
            return;
        }

        if (this.board.forward()) {
            this.scheduleTick();
        } else {
            this.pause();
        }
    }
}
