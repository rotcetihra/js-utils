import type {
    EqualsCase,
    EqualsCaseDescriptor,
    EqualsCaseGuardPredicate,
    EqualsCaseComparePredicate,
} from '@/index.mjs';
import createDescriptor from './createDescriptor.mts';

function createCase(
    guard: EqualsCaseGuardPredicate,
    compare: EqualsCaseComparePredicate,
    descriptor?: EqualsCaseDescriptor,
): EqualsCase {
    if (typeof guard !== 'function') {
        throw new TypeError(
            'EqualsCreateCaseTypeError: Параметр "guard" должен быть функцией.',
        );
    }

    if (typeof compare !== 'function') {
        throw new TypeError(
            'EqualsCreateCaseTypeError: Параметр "compare" должен быть функцией.',
        );
    }

    const equalsCase: EqualsCase = {
        guard: guard,
        compare: compare,
    } as const;

    if (typeof descriptor === 'object' && descriptor !== null) {
        if (!descriptor.case) {
            descriptor.case = equalsCase;
        }

        equalsCase.descriptor = createDescriptor(descriptor);
    }

    Object.freeze(equalsCase);

    return equalsCase;
}

export default createCase;
