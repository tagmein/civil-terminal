import { CivilMemoryKV } from '../types';
export declare function volatileKV(): CivilMemoryKV;
export type VolatileKV = typeof volatileKV & {
    name: 'volatileKV';
};
