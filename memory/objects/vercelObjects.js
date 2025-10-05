"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vercelObjects = vercelObjects;
function vercelObjects({ token, url, }) {
    let objects;
    return {
        async delete(key) {
            if (!objects) {
                objects = await import('@vercel/blob');
            }
            try {
                await objects.del(key, { token });
            }
            catch (e) {
                console.warn(e);
            }
        },
        async get(key) {
            if (!objects) {
                objects = await import('@vercel/blob');
            }
            const response = await fetch(`${url}/${key}`);
            if (!response.ok) {
                return null;
            }
            return response.body;
        },
        async info(key) {
            if (!objects) {
                objects = await import('@vercel/blob');
            }
            const info = await objects.head(key, {
                token,
            });
            return {
                createdAt: info.uploadedAt,
                key: info.pathname,
                size: info.size,
            };
        },
        async put(key, value) {
            if (!objects) {
                objects = await import('@vercel/blob');
            }
            await objects.put(key, value, {
                access: 'public',
                token,
            });
        },
    };
}
