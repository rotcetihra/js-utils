import { type EqualsCase, equals, equalsCreateCase } from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link URLSearchParams}.
 *
 * Guard срабатывает, если оба значения являются экземплярами `URLSearchParams`.
 *
 * Компаратор сравнивает мультимножество пар `[key, value]`, игнорируя порядок:
 * 1. Извлекает все пары (включая повторяющиеся ключи).
 * 2. Сортирует пары лексикографически по `key`, затем по `value`.
 * 3. Сравнивает длину и попарно элементы.
 *
 * Особенности:
 * - Порядок в исходной строке query **не важен**.
 * - Повторы учитываются: `a=1&a=1` ≠ `a=1`.
 * - Сравнение чувствительно к регистру в ключах и значениях.
 * - Нормализация кодирования/де-кодирования делается самим `URLSearchParams`:
 *   сравнение идёт по уже нормализованным строковым представлениям.
 *
 * @example
 * ```ts
 * const a = new URLSearchParams('a=1&b=2&b=3');
 * const b = new URLSearchParams('b=3&a=1&b=2');
 * // одинаковые пары в разном порядке → эквивалентны
 * EqualsURLSearchParamsCase[1](a, b, {}); // true
 *
 * const c = new URLSearchParams('a=1&a=1');
 * const d = new URLSearchParams('a=1');
 * // разное число повторов → неэквивалентны
 * EqualsURLSearchParamsCase[1](c, d, {}); // false
 * ```
 */
const URLSearchParamsCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof URLSearchParams && b instanceof URLSearchParams,

    /* compare: */ (a: unknown, b: unknown) => {
        const listA: [string, string][] = [];
        const listB: [string, string][] = [];

        (a as URLSearchParams).forEach((v, k) => listA.push([k, v]));
        (b as URLSearchParams).forEach((v, k) => listB.push([k, v]));

        if (listA.length !== listB.length) {
            return false;
        }

        const key = ([k, v]: [string, string]) => `${k}\u0000${v}`;

        listA.sort((p, q) => (key(p) < key(q) ? -1 : key(p) > key(q) ? 1 : 0));
        listB.sort((p, q) => (key(p) < key(q) ? -1 : key(p) > key(q) ? 1 : 0));

        for (let i = 0; i < listA.length; i++) {
            if (
                (listA[i] as [string, string])[0] !==
                    (listB[i] as [string, string])[0] ||
                (listA[i] as [string, string])[1] !==
                    (listB[i] as [string, string])[1]
            ) {
                return false;
            }
        }
        return true;
    },

    /* descriptor: */ {
        name: 'URLSearchParams',
    },
);

export default URLSearchParamsCase;
