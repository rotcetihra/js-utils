import type { EqualsOptions } from '@/index.mjs';

function parseOptions(options: EqualsOptions): EqualsOptions {
    return {
        ...options,
        loose: !!options.loose,
        ownKeys: !!options.ownKeys,
        compareDescriptors: !!options.compareDescriptors,
        deep: !!options.deep,
        depth:
            typeof options.depth === 'number' && options.depth >= 0
                ? options.depth
                : 10,
    };
}

export default parseOptions;
