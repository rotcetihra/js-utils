import {
    equals,
    equalsCreateCase,
    equalsParseOptions,
    type EqualsCase,
    type EqualsOptions,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link Set}.
 *
 * Guard срабатывает, если оба значения являются экземплярами `Set`.
 *
 * Компаратор:
 * 1. Проверяет совпадение размеров (`size`).
 * 2. Если `deep=false`:
 *    - для каждого элемента `v` из `a` проверяет, что `b.has(v)`.
 *    - работает для примитивов и идентичных ссылок.
 * 3. Если `deep=true`:
 *    - создаёт массив элементов `b` и массив флагов «использован»;
 *    - для каждого элемента `v` из `a` ищет неиспользованный элемент `w` из `b`,
 *      такой что `equals(v, w, nextOptions)` → `true`;
 *    - если не найдено — возвращает `false`;
 *    - иначе помечает `w` как использованный;
 *    - если все элементы найдены пары → возвращает `true`.
 *
 * @example
 * ```ts
 * const s1 = new Set([1, 2, 3]);
 * const s2 = new Set([1, 2, 3]);
 * EqualsSetCase[1](s1, s2, {}); // true
 *
 * const s3 = new Set([{x: 1}]);
 * const s4 = new Set([{x: 1}]);
 * EqualsSetCase[1](s3, s4, { deep: true }); // true
 * EqualsSetCase[1](s3, s4, {});             // false (разные ссылки)
 * ```
 */
const SetCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof Set && b instanceof Set,

    /* compare: */ (a: unknown, b: unknown, o: EqualsOptions) => {
        const sa = a as Set<unknown>;
        const sb = b as Set<unknown>;

        if (sa.size !== sb.size) {
            return false;
        }

        // Быстрый путь: без deep
        if (!o.deep) {
            for (const v of sa) {
                if (!sb.has(v)) {
                    return false;
                }
            }

            return true;
        }

        // Глубокое сравнение
        const arrB = Array.from(sb);
        const used = new Array(arrB.length).fill(false);
        const nextOptions =
            o.depth === undefined ? o : { ...o, depth: (o.depth ?? 0) - 1 };

        outer: for (const va of sa) {
            for (let i = 0; i < arrB.length; i++) {
                if (used[i]) {
                    continue;
                }

                if (equals(va, arrB[i], nextOptions)) {
                    used[i] = true;

                    continue outer;
                }
            }

            return false; // не нашли пару
        }

        return true;
    },

    /* descriptor: */ {
        name: 'Set',
        options: {
            deep: false,
            depth: 10,
        },
        parseOptions: equalsParseOptions,
    },
);

export default SetCase;
