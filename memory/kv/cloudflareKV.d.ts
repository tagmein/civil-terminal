import type { KVNamespace } from '@cloudflare/workers-types';
import { CivilMemoryKV } from '../types';
export declare function cloudflareKV({ binding, }: {
    binding: KVNamespace;
}): CivilMemoryKV;
export type CloudflareKV = typeof cloudflareKV & {
    name: 'cloudflareKV';
};
