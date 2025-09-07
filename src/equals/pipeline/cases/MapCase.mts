import {
    equals,
    equalsCreateCase,
    equalsParseOptions,
    equalsPrimitive,
    type EqualsCase,
    type EqualsOptions,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link Map}.
 *
 * Guard срабатывает, если оба значения являются экземплярами `Map`.
 *
 * Компаратор:
 * 1) Проверяет совпадение размеров (`size`).
 * 2) Если `deep = false`:
 *    - для каждой пары `[k, v]` из `a` проверяет, что `b.has(k)` (ключи сравниваются
 *      по семантике `Map` — SameValueZero: `+0` и `-0` равны, `NaN` равен `NaN`);
 *    - затем сравнивает значения через {@link equalsPrimitive} c учётом `loose`.
 * 3) Если `deep = true`:
 *    - строит массив пар из `b` и массив флагов «использовано»;
 *    - для каждой пары `[ka, va]` из `a` ищет неиспользованную пару `[kb, vb]` из `b`,
 *      такую что `equals(ka, kb, nextOptions)` и `equals(va, vb, nextOptions)` возвращают `true`;
 *    - если такая пара не найдена — возвращает `false`, иначе помечает её как использованную;
 *    - если все пары нашли соответствие — возвращает `true`.
 *
 * Примечания:
 * - Быстрый путь полезен для карт с примитивными ключами/значениями и идентичными ссылками.
 * - Глубокий путь нужен, когда ключи/значения — сложные структуры и/или требуется `depth`.
 *
 * @example
 * ```ts
 * const a = new Map([['x', 1], ['y', 2]]);
 * const b = new Map([['y', 2], ['x', 1]]);
 * EqualsMapCase[1](a, b, {}); // true
 *
 * const c = new Map([[{ id: 1 }, { v: 10 }]]);
 * const d = new Map([[{ id: 1 }, { v: 10 }]]);
 * EqualsMapCase[1](c, d, { deep: true, depth: 5 }); // true
 * EqualsMapCase[1](c, d, {});                       // false (разные ссылки)
 * ```
 */
const MapCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof Map && b instanceof Map,

    /* compare: */ (a: unknown, b: unknown, o: EqualsOptions) => {
        const ma = a as Map<unknown, unknown>;
        const mb = b as Map<unknown, unknown>;

        if (ma.size !== mb.size) {
            return false;
        }

        // Быстрый путь: без deep — проверяем по семантике Map.has + equalsPrimitive для значений
        if (!o.deep) {
            for (const [ka, va] of ma) {
                if (!mb.has(ka)) {
                    return false;
                }

                const vb = mb.get(ka);

                if (!equalsPrimitive(va, vb, !!o.loose)) {
                    return false;
                }
            }
            return true;
        }

        // Глубокий путь: биекция пар
        const entriesB = Array.from(mb.entries());
        const used = new Array(entriesB.length).fill(false);
        const nextOptions =
            o.depth === undefined ? o : { ...o, depth: (o.depth ?? 0) - 1 };

        outer: for (const [ka, va] of ma) {
            for (let i = 0; i < entriesB.length; i++) {
                if (used[i]) {
                    continue;
                }

                const [kb, vb] = entriesB[i] as [unknown, unknown];

                if (
                    equals(ka, kb, nextOptions) &&
                    equals(va, vb, nextOptions)
                ) {
                    used[i] = true;

                    continue outer;
                }
            }

            // Не нашли пару для [ka, va]
            return false;
        }

        return true;
    },

    /* descriptor: */ {
        name: 'Map',
        options: {
            loose: false,
            deep: false,
            depth: 10,
        },
        parseOptions: equalsParseOptions,
    },
);

export default MapCase;
