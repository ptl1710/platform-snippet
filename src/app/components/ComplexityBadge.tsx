import React from "react";

type Props = {
    complexity: string;
};

function getColor(complexity: string): string {
    if (/O\(1\)/.test(complexity)) return "bg-green-100 text-green-700 border-green-300";
    if (/O\(n\)/.test(complexity) && !/O\(n\^2\)/.test(complexity)) return "bg-blue-100 text-blue-700 border-blue-300";
    if (/O\(n\^?2|\bn\*n\b/.test(complexity)) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    if (/O\((n log n|log n)\)/i.test(complexity)) return "bg-indigo-100 text-indigo-700 border-indigo-300";
    if (/O\(2\^n\)/.test(complexity)) return "bg-red-100 text-red-700 border-red-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
}

export default function ComplexityBadge({ complexity }: Props) {
    return (
        <span
            className={`inline-block text-xs font-medium px-2 py-1 rounded-full border ${getColor(complexity)}`}
            title={`Estimated Time Complexity: ${complexity}`}
        >
            {complexity}
        </span>
    );
}
