import { useEffect, RefObject } from "react";

const useClickOutSide = (ref: RefObject<HTMLElement>, callback: () => void) => {

    const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
};



export default useClickOutSide;