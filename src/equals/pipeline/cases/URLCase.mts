import { type EqualsCase, equals, equalsCreateCase } from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link URL}.
 *
 * Guard срабатывает, если оба значения являются экземплярами `URL`.
 *
 * Компаратор сравнивает нормализованные строки `href` через строгое равенство:
 * - Нормализация выполняется самим конструктором `URL` (приведение хоста к нижнему
 *   регистру, добавление завершающего `/` в пустом пути, опускание стандартного порта
 *   и т.п.).
 * - Порядок query-параметров учитывается как часть `href` (т.е. `?a=1&b=2` ≠ `?b=2&a=1`).
 * - Фрагмент (`hash`) входит в сравнение.
 *
 * @example
 * ```ts
 * const a = new URL('https://example.com:443/path?x=1#h');
 * const b = new URL('https://EXAMPLE.com/path?x=1#h');
 * EqualsURLCase[0](a, b, {}); // true — оба URL
 * EqualsURLCase[1](a, b, {}); // true — href совпадает после нормализации
 *
 * // Порядок query значим
 * const c = new URL('https://example.com/?a=1&b=2');
 * const d = new URL('https://example.com/?b=2&a=1');
 * EqualsURLCase[1](c, d, {}); // false
 * ```
 */
const URLCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof URL && b instanceof URL,

    /* compare: */ (a: unknown, b: unknown) =>
        (a as URL).href === (b as URL).href,

    /* descriptor: */ {
        name: 'URL',
    },
);

export default URLCase;
