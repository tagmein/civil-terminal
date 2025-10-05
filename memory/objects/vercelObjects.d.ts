import { CivilMemoryObjects } from '../types';
export declare function vercelObjects({ token, url, }: {
    token: string;
    url: string;
}): CivilMemoryObjects;
export type VercelObjects = typeof vercelObjects & {
    name: 'vercelObjects';
};
