"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudflareObjects = cloudflareObjects;
function cloudflareObjects({ binding, }) {
    return {
        async delete(key) {
            await binding.delete(key);
        },
        async get(key) {
            const obj = await binding.get(key);
            if (!obj) {
                return null;
            }
            return obj.body;
        },
        async info(key) {
            const obj = await binding.head(key);
            return obj
                ? {
                    createdAt: obj.uploaded,
                    key: obj.key,
                    size: obj.size,
                }
                : {
                    createdAt: new Date(0),
                    key,
                    size: 0,
                };
        },
        async put(key, value) {
            await binding.put(key, value);
        },
    };
}
