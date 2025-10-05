import type { R2Bucket } from '@cloudflare/workers-types';
import { CivilMemoryObjects } from '../types';
export declare function cloudflareObjects({ binding, }: {
    binding: R2Bucket;
}): CivilMemoryObjects;
export type CloudflareObjects = typeof cloudflareObjects & {
    name: 'cloudflareObjects';
};
