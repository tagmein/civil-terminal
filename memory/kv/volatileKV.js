"use strict";
export function volatileKV() {
    const data = new Map();
    return {
        async delete(key) {
            const [namespace, keyName] = key.includes('#')
                ? key.split('#')
                : ['main', key];
            const namespaceMap = data.get(namespace);
            namespaceMap?.delete?.(keyName);
        },
        async get(key) {
            const [namespace, keyName] = key.includes('#')
                ? key.split('#')
                : ['main', key];
            const namespaceMap = data.get(namespace);
            if (!namespaceMap)
                return null;
            return namespaceMap.get(keyName);
        },
        async set(key, value) {
            const [namespace, keyName] = key.includes('#')
                ? key.split('#')
                : ['main', key];
            let namespaceMap = data.get(namespace);
            if (!namespaceMap) {
                namespaceMap = new Map();
                data.set(namespace, namespaceMap);
            }
            namespaceMap.set(keyName, value);
        },
    };
}
