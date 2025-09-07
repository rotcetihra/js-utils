import type { EqualsCase, EqualsOptions } from '@/index.mjs';

interface CaseDescriptor {
    name: string;
    case?: EqualsCase;
    id?: string;
    options?: unknown;
    parseOptions?: (o: EqualsOptions) => unknown;
}

export type { CaseDescriptor };
