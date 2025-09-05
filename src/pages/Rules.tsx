import React from "react";
import PieceMoves from "../components/PieceMoves";

const Rules = () => {
    return (
        <div className="min-h-screen  p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Custom Chess Rules</h1>
            <PieceMoves />
        </div>
    );
};

export default Rules;
