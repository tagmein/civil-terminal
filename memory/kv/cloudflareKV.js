"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudflareKV = cloudflareKV;
function cloudflareKV({ binding, }) {
    return {
        delete(_key) {
            const key = _key.includes('#') ? _key : 'main#' + _key;
            return binding.delete(key);
        },
        get(_key) {
            const key = _key.includes('#') ? _key : 'main#' + _key;
            return binding.get(key);
        },
        set(_key, value) {
            const key = _key.includes('#') ? _key : 'main#' + _key;
            return binding.put(key, value);
        },
    };
}
