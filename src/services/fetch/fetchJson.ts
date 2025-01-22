// performs a request and resolves with JSON
export const fetchJson = async (url: string, init = {}) => {
    const res = await fetch(url, init);
    if (!res.ok) {
        console.log('fetchJson-err', res)
        // throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
};