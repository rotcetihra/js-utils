import type { EqualsCaseDescriptor } from '@/index.mjs';

function createDescriptor(descriptor: object): EqualsCaseDescriptor {
    if (typeof descriptor !== 'object' || descriptor === null) {
        throw new TypeError(
            'EqualsCaseCreateDescriptorTypeError: Дескриптор кейса должен быть объектом.',
        );
    }

    const d = descriptor as EqualsCaseDescriptor;

    if (!d.name) {
        throw new TypeError(
            'EqualsCaseCreateDescriptorTypeError: Отсутствует обязательное имя кейса.',
        );
    }

    if (!d.case) {
        throw new TypeError(
            'EqualsCaseCreateDescriptorTypeError: Отсутствует обязательная ссылка на кейс.',
        );
    }

    return Object.freeze({
        id: d.id || `Equals${d.name}Case`,
        name: d.name,
        case: d.case,
        options: d.options,
        parseOptions: d.parseOptions,
    } as const);
}

export default createDescriptor;
