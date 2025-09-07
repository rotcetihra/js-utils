import {
    equals,
    equalsCreateCase,
    equalsParseOptions,
    equalsPrimitive,
    type EqualsCase,
    type EqualsOptions,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий массивы (`Array`).
 *
 * Guard срабатывает, если оба значения являются массивами.
 *
 * Компаратор:
 * 1. Проверяет совпадение длины массивов.
 * 2. Проверяет «дырки» — наличие элементов по каждому индексу должно совпадать
 *    (например, `[ ,1]` и `[undefined,1]` — разные).
 * 3. Сравнивает элементы:
 *    - если включён `deep` и `depth > 0` → рекурсивно вызывает {@link equals},
 *      уменьшая глубину;
 *    - иначе — сравнивает через {@link equalsPrimitive}.
 *
 * @example
 * ```ts
 * const a = [1, 2, 3];
 * const b = [1, 2, 3];
 * EqualsArrayCase[1](a, b, {}); // true
 *
 * const c = [1, , 3];      // дырка
 * const d = [1, undefined, 3];
 * EqualsArrayCase[1](c, d, {}); // false
 * ```
 */
const ArrayCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        Array.isArray(a) && Array.isArray(b),

    /* compare: */ (a: unknown, b: unknown, o: EqualsOptions) => {
        const arrA = a as unknown[];
        const arrB = b as unknown[];

        if (arrA.length !== arrB.length) {
            return false;
        }

        const recurse = !!o.deep && (o.depth === undefined || o.depth > 0);

        const nextOptions =
            o.depth === undefined ? o : { ...o, depth: (o.depth ?? 0) - 1 };

        for (let i = 0; i < arrA.length; i++) {
            const hasA = i in arrA;
            const hasB = i in arrB;

            if (hasA !== hasB) {
                return false;
            }

            if (hasA) {
                if (recurse) {
                    if (!equals(arrA[i], arrB[i], nextOptions)) {
                        return false;
                    }
                } else {
                    if (!equalsPrimitive(arrA[i], arrB[i], !!o.loose)) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    /* descriptor: */ {
        name: 'Array',
        options: {
            loose: false,
            deep: false,
            depth: 10,
        },
        parseOptions: equalsParseOptions,
    },
);

export default ArrayCase;
