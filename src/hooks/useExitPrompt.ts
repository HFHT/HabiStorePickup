import { useState, useEffect } from 'react';

const initBeforeUnLoad = (showExitPrompt: boolean, log: Function | void) => {
    window.onbeforeunload = (event) => {
        console.log('beforeunload', showExitPrompt)
        log && log()
        if (showExitPrompt) {
            const e = event || window.event;
            e.preventDefault();
            if (e) {
                e.returnValue = '';
            }
            return '';
        }
    };
};

// Hook
export function useExitPrompt(bool: any, log: Function | void) {
    const [showExitPrompt, setShowExitPrompt] = useState(bool);
    window.onload = function () {
        initBeforeUnLoad(showExitPrompt, log);
    };

    useEffect(() => {
        initBeforeUnLoad(showExitPrompt, log);
    }, [showExitPrompt]);

    return [showExitPrompt, setShowExitPrompt];
}