import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Sword, Shield, Swords, Castle, MoveRight } from "lucide-react";

const pieceMoves = [
    {
        name: "Pawn ♟️",
        description: `Moves diagonally forward into empty squares. Captures directly forward if any enemy piece is in front. Cannot move straight forward like in normal chess.`,
    },
    {
        name: "Rook ♜",
        description: `Moves only to the 2nd, 4th, or 6th square in a straight line. Cannot stop on odd-numbered squares. Captures enemy pieces if they are on an allowed square.`,
    },
    {
        name: "Knight ♞",
        description: `Each turn randomly chooses to behave like a rook, bishop, or knight. Movement is restricted to the 3×3 area around it.`,
    },
    {
        name: "Bishop ♝",
        description: `Moves like a normal bishop (any distance diagonally). Special ability: if it captures, it swaps positions with a random friendly pawn.`,
    },
    {
        name: "Queen ♛",
        description: `Moves normally like rook + bishop combined. Exception: if a friendly pawn is directly in front, she is blocked but may step one square past it.`,
    },
    {
        name: "King ♚",
        description: `Moves like a normal king: one square in any direction. No extra rules.`,
    },
];

export default function PieceMoves() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
            {pieceMoves.map((piece, index) => (
                <Card key={index} className="rounded-2xl shadow-md hover:shadow-lg transition">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-2">{piece.name}</h2>
                        <p className="text-sm text-gray-600">{piece.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
