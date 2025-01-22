export async function fetchSAS() {
    const { url, sasKey } = await (await fetch(`${import.meta.env.VITE_DRIVER_URL}getSASkeyV0?cont=habistorepickup`)).json();
    return { url, sasKey };
  }
  