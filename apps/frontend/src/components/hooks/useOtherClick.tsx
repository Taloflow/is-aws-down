/*
  Custom Hook
*/
import {useEffect, useRef} from "react";
// https://stackoverflow.com/a/54292872/12563520
// https://creativecommons.org/licenses/by-sa/4.0/
export function useOuterClick(callback) {
    const innerRef = useRef();
    const callbackRef = useRef();

    // set current callback in ref, before second useEffect uses it
    useEffect(() => { // useEffect wrapper to be safe for concurrent mode
        callbackRef.current = callback;
    });

    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);

        // read most recent callback and innerRef dom node from refs
        function handleClick(e) {
            if (
                innerRef.current &&
                callbackRef.current &&
                // @ts-ignore
                !innerRef.current.contains(e.target)
            ) {
                // @ts-ignore
                callbackRef.current(e);
            }
        }
    }, []); // no need for callback + innerRef dep

    return innerRef; // return ref; client can omit `useRef`
}