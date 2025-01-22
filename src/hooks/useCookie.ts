import { useState } from 'react';

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
    return null;
}

function setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; Max-Age=-99999999;`;
}

export function useCookie(cookieName: string) {
    const [cookie, setCookieState] = useState<string | null>(() => getCookie(cookieName));

    const updateCookie = (value: string, days: number) => {
        setCookie(cookieName, value, days);
        setCookieState(value);
    };

    const removeCookie = () => {
        deleteCookie(cookieName);
        setCookieState(null);
    };

    return [cookie, updateCookie, removeCookie] as const;
}