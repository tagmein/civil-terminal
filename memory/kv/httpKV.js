"use strict";
export function httpKV({ baseUrl }) {
    return {
        async get(key) {
            const url = new URL(baseUrl);
            url.searchParams.set('key', key);
            const finalUrl = url.toString();
            const resp = await fetch(finalUrl);
            // treat not found as null
            if (resp.status === 404) {
                return null;
            }
            if (!resp.ok) {
                const responseText = await resp.text();
                throw new Error(`GET ${finalUrl}: HTTP ${resp.status}: ${resp.statusText}: ${responseText}`);
            }
            return resp.text();
        },
        async set(key, value) {
            const url = new URL(baseUrl);
            url.searchParams.set('key', key);
            const finalUrl = url.toString();
            const method = 'POST';
            const resp = await fetch(finalUrl, {
                method,
                body: value,
            });
            if (!resp.ok) {
                const responseText = await resp.text();
                throw new Error(`${method} ${finalUrl}: HTTP ${resp.status}: ${resp.statusText}: ${responseText}`);
            }
        },
        async delete(key) {
            const url = new URL(baseUrl);
            url.searchParams.set('key', key);
            const finalUrl = url.toString();
            const method = 'DELETE';
            const resp = await fetch(finalUrl, { method });
            if (!resp.ok) {
                const responseText = await resp.text();
                throw new Error(`${method} ${finalUrl}: HTTP ${resp.status}: ${resp.statusText}: ${responseText}`);
            }
        },
    };
}
