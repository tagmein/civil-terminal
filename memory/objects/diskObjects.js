"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diskObjects = diskObjects;
function diskObjects({ rootDir, fs, fsPromises, path, }) {
    let isInitialized = false;
    async function diskPath(namespace, key) {
        const namespaceDirPath = path.join(rootDir, encodeURIComponent(namespace));
        await fsPromises.mkdir(namespaceDirPath, {
            recursive: true,
            // todo cache our knowledge that the directory
            // exists for performance enhancement here
        });
        isInitialized = true;
        return path.join(rootDir, encodeURIComponent(namespace), encodeURIComponent(key));
    }
    return {
        async delete(key) {
            const namespace = key.split('#')[0];
            try {
                await fsPromises.unlink(await diskPath(namespace, key));
            }
            catch (e) { }
        },
        async get(key) {
            const namespace = key.split('#')[0];
            try {
                const stream = fs.createReadStream(await diskPath(namespace, key));
                return new ReadableStream({
                    start(controller) {
                        stream.on('data', (chunk) => controller.enqueue(chunk instanceof Buffer
                            ? new Uint8Array(chunk)
                            : new Uint8Array(Buffer.from(chunk))));
                        stream.on('end', () => controller.close());
                        stream.on('error', (err) => controller.error(err));
                    },
                });
            }
            catch (e) {
                return null;
            }
        },
        async info(key) {
            const namespace = key.split('#')[0];
            const fileStats = await fsPromises.stat(await diskPath(namespace, key));
            return {
                createdAt: fileStats.birthtime,
                key,
                size: fileStats.size,
            };
        },
        async put(key, value) {
            const namespace = key.split('#')[0];
            const fileName = await diskPath(namespace, key);
            const reader = value.getReader();
            const fileStream = fs.createWriteStream(fileName);
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    fileStream.write(value);
                }
            }
            finally {
                fileStream.end();
            }
        },
    };
}
