import {
    equals,
    equalsPrimitive,
    EqualsFastCase,
    EqualsNullCase,
    EqualsNotObjectCase,
    EqualsPrototypeCase,
    type EqualsCase,
    type EqualsOptions,
    equalsCreateCase,
    equalsParseOptions,
} from '@/index.mjs';

/**
 * Кейс структурного сравнения «плоских»/plain-объектов.
 *
 * ⚠️ Guard здесь всегда возвращает `true`. Предполагается, что этот кейс
 * располагается ПОСЛЕ быстрых/отрицательных фильтров в пайплайне
 * (например, {@link EqualsFastCase}, {@link EqualsNullCase}, {@link EqualsNotObjectCase},
 * {@link EqualsPrototypeCase}) и получает на вход совместимые объектные пары.
 *
 * Алгоритм компаратора:
 *
 * 1) Получает список ключей:
 *    - если `options.ownKeys === true` → использует `Reflect.ownKeys(obj)` (включая символы и неэнумерируемые);
 *    - иначе → обычные строковые enum-ключи через `Object.keys(obj)`.
 *
 * 2) Быстро сверяет множества ключей по длине и принадлежности.
 *
 * 3) Для каждого ключа:
 *
 *    - если `options.compareDescriptors === true` → сверяет дескрипторы
 *      (`enumerable`, `configurable`, а также `writable`/`get`/`set` при их наличии);
 *
 *    - затем сравнивает значения:
 *
 *        • при `options.deep === true` и `depth > 0` → рекурсивно вызывает {@link equals}
 *          с уменьшенной глубиной;
 *
 *        • иначе → сравнивает примитивно через {@link equalsPrimitive} (уважает `loose`).
 *
 * Ограничения/заметки:
 *
 * - Сравнение прототипов **не выполняется**: это обязанность предыдущего кейса
 *   (например, {@link EqualsPrototypeCase}). Если его убрать, разные классы с одинаковыми
 *   полями могут пройти сравнение.
 *
 * - Циклические структуры должны обрабатываться в общей функции {@link equals}
 *   (например, через WeakMap посещённых пар) — здесь это не реализуется.
 *
 * Примеры:
 *
 * ```ts
 * // Обычное структурное равенство
 * const a = { x: 1, y: { z: 2 } };
 * const b = { y: { z: 2 }, x: 1 };
 * EqualsPlainObjectCase[1](a, b, { deep: true, depth: 5 }); // true
 *
 * // Различия в дескрипторах отлавливаются только при compareDescriptors
 * const o1 = {}; Object.defineProperty(o1, 'x', { value: 1, enumerable: false });
 * const o2 = {}; Object.defineProperty(o2, 'x', { value: 1, enumerable: true  });
 * EqualsPlainObjectCase[1](o1, o2, { compareDescriptors: false }); // true
 * EqualsPlainObjectCase[1](o1, o2, { compareDescriptors: true  }); // false
 *
 * // ownKeys включает символы:
 * const s = Symbol('k');
 * const p = { [s]: 1 };
 * const q = { [s]: 1 };
 * EqualsPlainObjectCase[1](p, q, { ownKeys: true });  // true (учли символ)
 * EqualsPlainObjectCase[1](p, q, { ownKeys: false }); // true, если кроме символов ключей нет
 * ```
 */
const PlainObjectCase: EqualsCase = equalsCreateCase(
    /* guard: */ () => true,

    /* compare: */ (a: unknown, b: unknown, o: EqualsOptions) => {
        const objA = a as Record<PropertyKey, unknown>;
        const objB = b as Record<PropertyKey, unknown>;

        const keysA = o.ownKeys ? Reflect.ownKeys(objA) : Object.keys(objA);
        const keysB = o.ownKeys ? Reflect.ownKeys(objB) : Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        const setB = new Set(keysB);

        for (const k of keysA) {
            if (!setB.has(k)) {
                return false;
            }
        }

        const recurse = !!o.deep && (o.depth === undefined || o.depth > 0);
        const nextOptions =
            o.depth === undefined ? o : { ...o, depth: (o.depth ?? 0) - 1 };

        for (const k of keysA) {
            if (o.compareDescriptors) {
                const da = Object.getOwnPropertyDescriptor(objA, k);
                const db = Object.getOwnPropertyDescriptor(objB, k);

                if (!da || !db) {
                    return false;
                }

                if (!!da.enumerable !== !!db.enumerable) {
                    return false;
                }

                if (!!da.configurable !== !!db.configurable) {
                    return false;
                }

                const wa =
                    'writable' in da
                        ? !!(da as PropertyDescriptor).writable
                        : undefined;
                const wb =
                    'writable' in db
                        ? !!(db as PropertyDescriptor).writable
                        : undefined;

                if (wa !== wb) {
                    return false;
                }

                const ga =
                    'get' in da ? (da as PropertyDescriptor).get : undefined;
                const gb =
                    'get' in db ? (db as PropertyDescriptor).get : undefined;
                const sa =
                    'set' in da ? (da as PropertyDescriptor).set : undefined;
                const sb =
                    'set' in db ? (db as PropertyDescriptor).set : undefined;

                if (ga !== gb || sa !== sb) {
                    return false;
                }
            }

            const va = objA[k];
            const vb = objB[k];

            if (recurse) {
                if (!equals(va, vb, nextOptions)) {
                    return false;
                }
            } else {
                if (!equalsPrimitive(va as any, vb as any, !!o.loose)) {
                    return false;
                }
            }
        }

        return true;
    },

    /* descriptor: */ {
        name: 'PlainObject',
        options: {
            loose: false,
            ownKeys: false,
            compareDescriptors: false,
            deep: false,
            depth: 10,
        },
        parseOptions: equalsParseOptions,
    },
);

export default PlainObjectCase;
