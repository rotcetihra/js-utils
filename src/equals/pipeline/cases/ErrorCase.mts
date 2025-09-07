import {
    equals,
    equalsCreateCase,
    equalsParseOptions,
    equalsPrimitive,
    type EqualsCase,
    type EqualsOptions,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link Error} (и подклассы).
 *
 * Guard срабатывает, если оба значения являются экземплярами `Error`.
 *
 * Компаратор:
 * - сравнивает `name` и `message` через {@link equalsPrimitive} с учётом `loose`;
 * - затем сравнивает наличие `cause` (если в обоих присутствует:
 *   • при `deep=true` и `depth>0` — рекурсивно через {@link equals} (уменьшая `depth`);
 *   • иначе — примитивно через {@link equalsPrimitive} с учётом `loose`);
 * - свойство `stack` игнорируется.
 *
 * Примеры:
 * ```ts
 * const a = new TypeError('boom');
 * const b = new TypeError('boom');
 * EqualsErrorCase[1](a, b, {}); // true
 *
 * const c: any = new Error('e'); c.cause = { code: 1 };
 * const d: any = new Error('e'); d.cause = { code: 1 };
 * EqualsErrorCase[1](c, d, { deep: true, depth: 5 }); // true
 *
 * const e: any = new Error('e'); e.cause = '1';
 * const f: any = new Error('e'); f.cause = 1;
 * EqualsErrorCase[1](e, f, { deep: false, loose: true });  // true
 * EqualsErrorCase[1](e, f, { deep: false, loose: false }); // false
 * ```
 */
const ErrorCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof Error && b instanceof Error,

    /* compare: */ (a: unknown, b: unknown, o: EqualsOptions) => {
        const ea = a as Error & { cause?: unknown };
        const eb = b as Error & { cause?: unknown };

        if (!equalsPrimitive(ea.name, eb.name, !!o.loose)) {
            return false;
        }

        if (!equalsPrimitive(ea.message, eb.message, !!o.loose)) {
            return false;
        }

        const hasCauseA = Object.prototype.hasOwnProperty.call(ea, 'cause');
        const hasCauseB = Object.prototype.hasOwnProperty.call(eb, 'cause');

        if (hasCauseA !== hasCauseB) {
            return false;
        }

        if (hasCauseA && hasCauseB) {
            const recurse = !!o.deep && (o.depth === undefined || o.depth > 0);
            const nextOptions =
                o.depth === undefined ? o : { ...o, depth: (o.depth ?? 0) - 1 };

            return recurse
                ? equals(ea.cause, eb.cause, nextOptions)
                : equalsPrimitive(ea.cause as any, eb.cause as any, !!o.loose);
        }

        return true;
    },

    /* descriptor: */ {
        name: 'Error',
        options: {
            loose: false,
            deep: false,
            depth: 10,
        },
        parseOptions: equalsParseOptions,
    },
);

export default ErrorCase;
