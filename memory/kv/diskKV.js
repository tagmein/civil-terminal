"use strict";
export function diskKV({ rootDir, fsPromises, path, }) {
    let isInitialized = false;
    async function diskPath(namespace, key) {
        if (namespace === '') {
            namespace = 'main';
        }
        if (key === '') {
            key = 'index';
        }
        const dirPath = [
            encodeURIComponent(namespace.split('/').map(encodeURIComponent).join('/')),
            ...key.split('/').map(encodeURIComponent),
        ];
        const fileName = dirPath.pop();
        if (dirPath.length > 0) {
            try {
                await fsPromises.mkdir(path.join(rootDir, ...dirPath), {
                    recursive: true,
                    // todo cache our knowledge that the directory
                    // exists for performance enhancement here
                });
            }
            catch (e) {
                // do nothing, our directory already exists
                if (!e.message.startsWith('EEXIST:')) {
                    console.warn(e);
                }
            }
        }
        isInitialized = true;
        return path.join(rootDir, ...dirPath, fileName);
    }
    return {
        async delete(_key) {
            const splitKey = _key.includes('#') ? _key.split('#') : ['main', _key];
            const namespace = splitKey.shift();
            const key = splitKey.join('#') || 'index';
            try {
                await fsPromises.unlink(await diskPath(namespace, key));
            }
            catch (e) {
                console.error(e);
            }
        },
        async get(_key) {
            const splitKey = _key.includes('#') ? _key.split('#') : ['main', _key];
            const namespace = splitKey.shift();
            const key = splitKey.join('#') || 'index';
            try {
                return (await fsPromises.readFile(await diskPath(namespace, key))).toString('utf8');
            }
            catch (e) {
                return null;
            }
        },
        async set(_key, value) {
            const splitKey = _key.includes('#') ? _key.split('#') : ['main', _key];
            const namespace = splitKey.shift();
            const key = splitKey.join('#') || 'index';
            await fsPromises.writeFile(await diskPath(namespace, key), value, 'utf8');
        },
    };
}
