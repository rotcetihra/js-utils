import {
    EqualsArrayBufferCase,
    EqualsArrayCase,
    EqualsBoxedCase,
    EqualsDataViewCase,
    EqualsDateCase,
    EqualsErrorCase,
    EqualsFastCase,
    EqualsFunctionCase,
    EqualsLooseCase,
    EqualsMapCase,
    EqualsNotObjectCase,
    EqualsNullCase,
    EqualsPlainObjectCase,
    EqualsPromiseCase,
    EqualsPrototypeCase,
    EqualsRegExpCase,
    EqualsSetCase,
    EqualsTypedArrayCase,
    EqualsURLCase,
    EqualsURLSearchParamsCase,
    EqualsWeakMapCase,
    EqualsWeakSetCase,
    type EqualsCase,
} from '@/index.mjs';

/**
 * Словарь всех предопределённых кейсов сравнения для {@link equals}.
 *
 * Каждый элемент — это замороженный кортеж типа {@link EqualsCase}:
 * `[guard, compare]`.
 *
 * - **Ключи**: строковые имена, отражающие назначение кейса
 *   (`"Fast"`, `"Loose"`, `"Date"`, `"Map"`, …).
 * - **Значения**: сами кейсы (guard + comparator).
 *
 * Зачем нужен этот словарь:
 *
 * 1. **Навигация и отладка**
 *    Можно быстро найти нужный кейс по имени и вызвать его вручную.
 *
 * 2. **Кастомизация пайплайнов**
 *    При необходимости можно собрать свой собственный пайплайн из
 *    отдельных кейсов:
 *
 *    ```ts
 *    import { EqualsPipelineCases } from '@rotcetihra/utils';
 *
 *    const customPipeline = [
 *      EqualsPipelineCases.Fast,
 *      EqualsPipelineCases.Loose,
 *      EqualsPipelineCases.Date,
 *      EqualsPipelineCases.PlainObject,
 *    ];
 *    ```
 *
 * Особенности:
 *
 * - Типизирован как `Readonly<Record<string, EqualsCase>>`, что гарантирует,
 *   что все значения будут именно корректными кейсами.
 * - Вызов `Object.freeze` защищает словарь от модификации в рантайме.
 * - Порядок ключей здесь не влияет на работу {@link EqualsPipelineDefault},
 *   так как пайплайн формируется отдельно. Но удобно держать ключи в том же
 *   порядке, что и в дефолтном пайплайне, чтобы их легко сверять.
 *
 * @example
 * Проверка конкретного кейса:
 *
 * ```ts
 * import { EqualsPipelineCases } from '@rotcetihra/utils';
 *
 * const [guard, compare] = EqualsPipelineCases.Date;
 *
 * const d1 = new Date(1000);
 * const d2 = new Date(1000);
 *
 * guard(d1, d2, {});   // true — оба значения Date
 * compare(d1, d2, {}); // true — одинаковый timeValue
 * ```
 */
const cases: Readonly<Record<string, EqualsCase>> = Object.freeze({
    ArrayBuffer: EqualsArrayBufferCase,
    Array: EqualsArrayCase,
    Boxed: EqualsBoxedCase,
    DataView: EqualsDataViewCase,
    Date: EqualsDateCase,
    Error: EqualsErrorCase,
    Fast: EqualsFastCase,
    Function: EqualsFunctionCase,
    Loose: EqualsLooseCase,
    Map: EqualsMapCase,
    NotObject: EqualsNotObjectCase,
    Null: EqualsNullCase,
    PlainObject: EqualsPlainObjectCase,
    Promise: EqualsPromiseCase,
    Prototype: EqualsPrototypeCase,
    RegExp: EqualsRegExpCase,
    Set: EqualsSetCase,
    TypedArray: EqualsTypedArrayCase,
    URL: EqualsURLCase,
    URLSearchParams: EqualsURLSearchParamsCase,
    WeakMap: EqualsWeakMapCase,
    WeakSet: EqualsWeakSetCase,
} as const);

export default cases;
