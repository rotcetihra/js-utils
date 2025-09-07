import { EqualsFastCase, EqualsNullCase } from '@/index.mjs';

describe('EqualsNullCase', () => {
    const [guard, compare] = EqualsNullCase;

    test('guard срабатывает, когда одно из значений null', () => {
        expect(guard(null, 0, {})).toBe(true);
        expect(compare(null, 0, {})).toBe(false);

        expect(guard('x', null, {})).toBe(true);
        expect(compare('x', null, {})).toBe(false);
    });

    test('guard не срабатывает, когда оба значения НЕ null', () => {
        expect(guard(0, 0, {})).toBe(false);
        expect(guard('a', 'b', {})).toBe(false);
        expect(guard({}, {}, {})).toBe(false);
        expect(guard(undefined, undefined, {})).toBe(false); // именно null, не undefined
    });

    test('оба null: этот кейс в изоляции бы сработал, но в реальном пайплайне его перекрывает EqualsFastCase', () => {
        // ПОВЕДЕНИЕ САМОГО КЕЙСА:
        // его guard написан как (a === null || b === null), поэтому тут он true:
        expect(guard(null, null, {})).toBe(true);

        // НО В РЕАЛЕ: пайплайн должен идти [EqualsFastCase, EqualsLooseCase?, EqualsNullCase, ...]
        // Показательная «мини-реализация» пайплайна:
        const pipeline = [EqualsFastCase, EqualsNullCase] as const;

        const run = (a: unknown, b: unknown) => {
            for (const [g, c] of pipeline) {
                if (g(a, b, {} as any)) return c(a, b, {} as any);
            }
            return false;
        };

        // FastCase перехватывает идентичные значения (включая null/null)
        expect(run(null, null)).toBe(true);
    });

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsNullCase)).toBe(true);
    });
});
