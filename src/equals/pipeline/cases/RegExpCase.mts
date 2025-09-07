import { type EqualsCase, equals, equalsCreateCase } from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link RegExp}.
 *
 * Guard срабатывает, если оба аргумента являются экземплярами `RegExp`.
 *
 * Компаратор сравнивает:
 * 1) `source` — текст шаблона регулярного выражения без разделителей `/…/`;
 * 2) `flags` — строку флагов (в JavaScript она **канонизируется**: порядок флагов
 *    в свойстве `.flags` всегда лексикографический, например `'gim'`).
 *
 * Обратите внимание:
 * - Свойство `lastIndex` **не влияет** на эквивалентность.
 * - Два выражения считаются эквивалентными, если у них совпадают и `source`, и `flags`,
 *   независимо от того, как они были созданы (литерал `/…/` или `new RegExp()`).
 *
 * @example
 * ```ts
 * const r1 = /foo/gim;
 * const r2 = new RegExp('foo', 'img'); // флаги вернутся как 'gim'
 *
 * EqualsRegExpCase[0](r1, r2, {}); // true  — guard: оба RegExp
 * EqualsRegExpCase[1](r1, r2, {}); // true  — source и flags совпадают
 *
 * const r3 = /foo/g;
 * const r4 = /foo/i;
 * EqualsRegExpCase[1](r3, r4, {}); // false — разные flags
 *
 * const r5 = /foo/;
 * const r6 = /fo+o/;
 * EqualsRegExpCase[1](r5, r6, {}); // false — разный source
 *
 * // lastIndex игнорируется
 * const r7 = /bar/g; r7.lastIndex = 10;
 * const r8 = /bar/g; r8.lastIndex = 0;
 * EqualsRegExpCase[1](r7, r8, {}); // true
 * ```
 */
const RegExpCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof RegExp && b instanceof RegExp,

    /* compare: */ (a: unknown, b: unknown) =>
        (a as RegExp).source === (b as RegExp).source &&
        (a as RegExp).flags === (b as RegExp).flags,

    /* descriptor: */ {
        name: 'RegExp',
    },
);

export default RegExpCase;
