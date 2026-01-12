import { useMemo } from "react";

function Highlighted({ text, query }: { text: string; query: string }) {
    const parts = useMemo(() => {
        if (!query) return [text];
        const regex = new RegExp(`(${query})`, "gi");
        return text.split(regex).map((part, i) =>
            regex.test(part) ? <span key={i} className="bg-yellow-200">{part}</span> : part
        );
    }, [text, query]);
    return <>{parts}</>;
}
