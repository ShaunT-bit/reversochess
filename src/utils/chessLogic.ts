import { Board, ChessPiece, Position, PieceType, PieceColor, GameState } from '../types/chess.ts';
import { toast } from 'sonner';

export const initialBoard: Board = [
    [
        { type: 'rook', color: 'black' },
        { type: 'knight', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'queen', color: 'black' },
        { type: 'king', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'knight', color: 'black' },
        { type: 'rook', color: 'black' }
    ],
    Array(8).fill({ type: 'pawn', color: 'black' }),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill({ type: 'pawn', color: 'white' }),
    [
        { type: 'rook', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'queen', color: 'white' },
        { type: 'king', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'rook', color: 'white' }
    ]
];

export const isValidPosition = (pos: Position): boolean => {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

export const getPieceAt = (board: Board, pos: Position): ChessPiece | null => {
    if (!isValidPosition(pos)) return null;
    return board[pos.row][pos.col];
};

export const getValidMoves = (board: Board, from: Position, piece: ChessPiece): Position[] => {
    let moves: Position[] = [];

    switch (piece.type) {
        case 'pawn':
            moves = getPawnMoves(board, from, piece.color);
            break;
        case 'rook':
            moves = getRookMoves(board, from, piece.color);
            break;
        case 'knight':
            moves = getKnightMoves(board, from, piece.color);
            break;
        case 'bishop':
            moves = getBishopMoves(board, from, piece.color);
            break;
        case 'queen':
            moves = getQueenMoves(board, from, piece.color);
            break;
        case 'king':
            moves = getKingMoves(board, from, piece.color);
            break;
        default:
            moves = [];
    }

    return moves.filter(to => !wouldMoveResultInCheck(board, from, to, piece.color));
};
// 🟢 Pawn: moves diagonally if empty, captures forward (any enemy piece)
const getPawnMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
    const moves: Position[] = [];
    const direction = color === "white" ? -1 : 1;

    // Diagonal moves (only into empty squares)
    const diagLeft = { row: from.row + direction, col: from.col - 1 };
    const diagRight = { row: from.row + direction, col: from.col + 1 };

    [diagLeft, diagRight].forEach(pos => {
        if (isValidPosition(pos) && !getPieceAt(board, pos)) {
            moves.push(pos);
        }
    });

    // Forward capture (any enemy piece, not just pawns)
    const forward = { row: from.row + direction, col: from.col };
    const target = getPieceAt(board, forward);
    if (isValidPosition(forward) && target && target.color !== color) {
        moves.push(forward);
    }

    return moves;
};


// 🟢 Rook: moves only to 2nd, 4th, 6th squares in each direction
const getRookMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
    const moves: Position[] = [];
    const directions = [
        [0, 1],  // right
        [0, -1], // left
        [1, 0],  // down
        [-1, 0], // up
    ];

    directions.forEach(([dRow, dCol]) => {
        for (let i = 1; i < 8; i++) {
            const pos = { row: from.row + dRow * i, col: from.col + dCol * i };
            if (!isValidPosition(pos)) break;

            const piece = getPieceAt(board, pos);

            // ✅ Only allow even-numbered steps (2, 4, 6)
            if (i % 2 === 0) {
                if (!piece) {
                    moves.push(pos);
                } else {
                    if (piece.color !== color) moves.push(pos); // capture
                    break; // stop after hitting any piece
                }
            }

            if (piece) break; // stop if blocked before reaching further
        }
    });

    return moves;
};

// 🟢 Knight: random move (rook/bishop/knight) within 3x3 area
const getKnightMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
    const moves: Position[] = [];

    // Randomly choose mode: rook, bishop, or knight
    const modes = ["rook", "bishop", "knight"];
    const chosenMode = modes[Math.floor(Math.random() * modes.length)];

    if (chosenMode === "rook") {
        // Rook-like moves in 3x3 area
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        directions.forEach(([dRow, dCol]) => {
            for (let i = 1; i <= 2; i++) { // only 1 step (3x3 area)
                const pos = { row: from.row + dRow * i, col: from.col + dCol * i };
                if (!isValidPosition(pos)) break;
                const piece = getPieceAt(board, pos);
                if (!piece || piece.color !== color) moves.push(pos);
            }
        });
    }

    if (chosenMode === "bishop") {
        // Bishop-like moves in 3x3 area
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        directions.forEach(([dRow, dCol]) => {
            for (let i = 1; i <= 2; i++) { // only 1 step (3x3 area)
                const pos = { row: from.row + dRow * i, col: from.col + dCol * i };
                if (!isValidPosition(pos)) break;
                const piece = getPieceAt(board, pos);
                if (!piece || piece.color !== color) moves.push(pos);
            }
        });
    }

    if (chosenMode === "knight") {
        // Knight-like moves but restricted to 3x3 area
        const knightMoves = [
            { row: from.row + 2, col: from.col + 1 },
            { row: from.row + 2, col: from.col - 1 },
            { row: from.row - 2, col: from.col + 1 },
            { row: from.row - 2, col: from.col - 1 },
            { row: from.row + 1, col: from.col + 2 },
            { row: from.row + 1, col: from.col - 2 },
            { row: from.row - 1, col: from.col + 2 },
            { row: from.row - 1, col: from.col - 2 },
        ];

        knightMoves.forEach((pos) => {
            // ✅ only allow moves inside 3x3 area around the knight
            if (Math.abs(pos.row - from.row) <= 1 && Math.abs(pos.col - from.col) <= 1) {
                if (isValidPosition(pos)) {
                    const piece = getPieceAt(board, pos);
                    if (!piece || piece.color !== color) moves.push(pos);
                }
            }
        });
    }

    return moves;
};



// 🟢 Bishop: normal, but swaps with random pawn after capture
const getBishopMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
    const moves: Position[] = [];
    const directions = [[1,1],[1,-1],[-1,1],[-1,-1]];

    directions.forEach(([dRow, dCol]) => {
        for (let i = 1; i < 8; i++) {
            const pos = { row: from.row + dRow * i, col: from.col + dCol * i };
            if (!isValidPosition(pos)) break;

            const piece = getPieceAt(board, pos);
            if (!piece) {
                moves.push(pos);
            } else {
                if (piece.color !== color) moves.push(pos);
                break;
            }
        }
    });
    return moves;
};

// 🟢 Queen: normal, unless blocked by own pawn
const getQueenMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
    let moves: Position[] = [];
    const direction = color === "white" ? -1 : 1;
    const forward = { row: from.row + direction, col: from.col };
    const blocker = getPieceAt(board, forward);

    if (blocker && blocker.type === "pawn" && blocker.color === color) {
        const oneStep = { row: forward.row + direction, col: forward.col };
        if (isValidPosition(oneStep)) {
            const piece = getPieceAt(board, oneStep);
            if (!piece || piece.color !== color) moves.push(oneStep);
        }
    } else {
        // Full queen logic = rook + bishop directions
        const directions = [
            [1, 0],   // down
            [-1, 0],  // up
            [0, 1],   // right
            [0, -1],  // left
            [1, 1],   // down-right
            [1, -1],  // down-left
            [-1, 1],  // up-right
            [-1, -1], // up-left
        ];

        for (const [dRow, dCol] of directions) {
            let r = from.row + dRow;
            let c = from.col + dCol;

            while (isValidPosition({ row: r, col: c })) {
                const piece = getPieceAt(board, { row: r, col: c });

                if (!piece) {
                    moves.push({ row: r, col: c }); // empty square
                } else {
                    if (piece.color !== color) {
                        moves.push({ row: r, col: c }); // capture
                    }
                    break; // stop when hitting any piece
                }

                r += dRow;
                c += dCol;
            }
        }
    }

    return moves;
};

const getKingMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
    const moves: Position[] = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dRow, dCol]) => {
        const pos = { row: from.row + dRow, col: from.col + dCol };
        if (isValidPosition(pos)) {
            const piece = getPieceAt(board, pos);
            if (!piece || piece.color !== color) {
                moves.push(pos);
            }
        }
    });

    return moves;
};

// 🟢 Special bishop ability handled here
export const makeMove = (board: Board, from: Position, to: Position): Board => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];
    const captured = newBoard[to.row][to.col];

    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    // Bishop swap with random pawn after capture
    if (piece?.type === "bishop" && captured && captured.color !== piece.color) {
        const pawns: Position[] = [];
        newBoard.forEach((row, r) => row.forEach((p, c) => {
            if (p?.type === "pawn" && p.color === piece.color) {
                pawns.push({ row: r, col: c });
            }
        }));

        if (pawns.length > 0) {
            const randomPawn = pawns[Math.floor(Math.random() * pawns.length)];
            const temp = newBoard[randomPawn.row][randomPawn.col];
            newBoard[randomPawn.row][randomPawn.col] = newBoard[to.row][to.col];
            newBoard[to.row][to.col] = temp;
        }
    }

    return newBoard;
};

// ------------------- CHECK / GAME LOGIC (unchanged) -------------------

export const findKing = (board: Board, color: PieceColor): Position | null => {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece?.type === 'king' && piece.color === color) {
                return { row, col };
            }
        }
    }
    return null;
};

export const isSquareAttacked = (board: Board, position: Position, byColor: PieceColor): boolean => {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === byColor) {
                const from = { row, col };
                let moves: Position[] = [];

                switch (piece.type) {
                    case 'pawn': moves = getPawnMoves(board, from, piece.color); break;
                    case 'rook': moves = getRookMoves(board, from, piece.color); break;
                    case 'knight': moves = getKnightMoves(board, from, piece.color); break;
                    case 'bishop': moves = getBishopMoves(board, from, piece.color); break;
                    case 'queen': moves = getQueenMoves(board, from, piece.color); break;
                    case 'king': moves = getKingMoves(board, from, piece.color); break;
                }

                if (moves.some(move => move.row === position.row && move.col === position.col)) {
                    return true;
                }
            }
        }
    }
    return false;
};

export const isInCheck = (board: Board, color: PieceColor): boolean => {
    const kingPos = findKing(board, color);
    if (!kingPos) return false;

    const enemyColor: PieceColor = color === 'white' ? 'black' : 'white';
    return isSquareAttacked(board, kingPos, enemyColor);
};

export const wouldMoveResultInCheck = (board: Board, from: Position, to: Position, color: PieceColor): boolean => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    return isInCheck(newBoard, color);
};

export const isCheckmate = (board: Board, color: PieceColor): boolean => {
    if (!isInCheck(board, color)) return false;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === color) {
                const from = { row, col };
                const moves = getValidMoves(board, from, piece);
                if (moves.length > 0) {
                    return false;
                }
            }
        }
    }
    return true;
};

export const isStalemate = (board: Board, color: PieceColor): boolean => {
    if (isInCheck(board, color)) return false;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === color) {
                const from = { row, col };
                const moves = getValidMoves(board, from, piece);
                if (moves.length > 0) {
                    return false;
                }
            }
        }
    }
    return true;
};

// ------------------- GAME MANAGER (unchanged) -------------------

export interface ChessGameManager {
    gameState: GameState;
    queenMoved: { white: boolean; black: boolean };
    handleSquareClick: (position: Position) => void;
    resetGame: () => void;
    addListener: (listener: () => void) => () => void;
}

export const createChessGame = (): ChessGameManager => {
    let gameState: GameState = {
        board: initialBoard,
        currentPlayer: 'white',
        selectedSquare: null,
        validMoves: [],
        gameStatus: 'playing'
    };

    let queenMoved = { white: false, black: false };
    let listeners: Array<() => void> = [];

    const notifyListeners = () => listeners.forEach(listener => listener());
    const addListener = (listener: () => void) => {
        listeners.push(listener);
        return () => { listeners = listeners.filter(l => l !== listener); };
    };

    const handleSquareClick = (position: Position) => {
        const { board, currentPlayer, selectedSquare, validMoves } = gameState;
        const clickedPiece = getPieceAt(board, position);

        if (!selectedSquare) {
            if (clickedPiece && clickedPiece.color === currentPlayer) {
                const moves = getValidMoves(board, position, clickedPiece);
                gameState = { ...gameState, selectedSquare: position, validMoves: moves };
                notifyListeners();
            }
            return;
        }

        if (selectedSquare.row === position.row && selectedSquare.col === position.col) {
            gameState = { ...gameState, selectedSquare: null, validMoves: [] };
            notifyListeners();
            return;
        }

        const isValidMove = validMoves.some(move => move.row === position.row && move.col === position.col);

        if (isValidMove) {
            const movedPiece = getPieceAt(board, selectedSquare);
            const newBoard = makeMove(board, selectedSquare, position);
            const nextPlayer: PieceColor = currentPlayer === 'white' ? 'black' : 'white';

            if (movedPiece?.type === 'queen') {
                queenMoved = { ...queenMoved, [movedPiece.color]: true };
            }

            let newGameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate' = 'playing';
            if (isInCheck(newBoard, nextPlayer)) {
                if (isCheckmate(newBoard, nextPlayer)) {
                    newGameStatus = 'checkmate';
                    toast(`Checkmate! ${currentPlayer} wins!`);
                } else {
                    newGameStatus = 'check';
                    toast(`${nextPlayer} is in check!`);
                }
            } else if (isStalemate(newBoard, nextPlayer)) {
                newGameStatus = 'stalemate';
                toast('Stalemate! Game is a draw!');
            }

            gameState = {
                board: newBoard,
                currentPlayer: nextPlayer,
                selectedSquare: null,
                validMoves: [],
                gameStatus: newGameStatus
            };

            if (clickedPiece) {
                toast(`${currentPlayer} captured ${clickedPiece.type}!`);
            }
            notifyListeners();
        } else if (clickedPiece && clickedPiece.color === currentPlayer) {
            const moves = getValidMoves(board, position, clickedPiece);
            gameState = { ...gameState, selectedSquare: position, validMoves: moves };
            notifyListeners();
        } else {
            gameState = { ...gameState, selectedSquare: null, validMoves: [] };
            notifyListeners();
        }
    };

    const resetGame = () => {
        gameState = { board: initialBoard, currentPlayer: 'white', selectedSquare: null, validMoves: [], gameStatus: 'playing' };
        queenMoved = { white: false, black: false };
        toast('New game started!');
        notifyListeners();
    };

    return { get gameState() { return gameState; }, get queenMoved() { return queenMoved; }, handleSquareClick, resetGame, addListener };
};
