"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisKV = redisKV;
const redis_1 = require("redis");
function redisKV({ url }) {
    let kv;
    return {
        async delete(_key) {
            if (!kv) {
                kv = (await (0, redis_1.createClient)({ url }).connect());
            }
            const key = _key.includes('#') ? _key : 'main#' + _key;
            await kv.getDel(key);
        },
        async get(_key) {
            if (!kv) {
                kv = (await (0, redis_1.createClient)({ url }).connect());
            }
            const key = _key.includes('#') ? _key : 'main#' + _key;
            const value = await kv.get(key);
            if (value === null) {
                return null;
            }
            return value.toString();
        },
        async set(_key, value) {
            if (!kv) {
                kv = (await (0, redis_1.createClient)({ url }).connect());
            }
            const key = _key.includes('#') ? _key : 'main#' + _key;
            await kv.set(key, value);
        },
    };
}
