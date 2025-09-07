import {
    EqualsPipelineDefault,
    equalsPrimitive,
    EqualsBoxedCase,
    EqualsDateCase,
    EqualsFastCase,
    EqualsLooseCase,
    EqualsNotObjectCase,
    EqualsNullCase,
    EqualsPrototypeCase,
    EqualsRegExpCase,
    EqualsArrayBufferCase,
    EqualsDataViewCase,
    EqualsTypedArrayCase,
    EqualsArrayCase,
    EqualsSetCase,
    EqualsMapCase,
    EqualsPlainObjectCase,
    EqualsWeakSetCase,
    EqualsWeakMapCase,
    EqualsFunctionCase,
    EqualsPromiseCase,
    EqualsErrorCase,
    EqualsURLCase,
    EqualsURLSearchParamsCase,
    EqualsPipelineCases,
    type EqualsOptions,
} from '@/index.mjs';

function equals(
    a: unknown,
    b: unknown,
    options: EqualsOptions = {
        compareDescriptors: false,
        deep: false,
        depth: 10,
        loose: false,
        ownKeys: false,
    },
): boolean {
    if (typeof options !== 'object' || options === null) {
        throw new TypeError(
            'EqualsOptionsTypeError: Опции утилиты "equals" пакета "@rotcetihra/utils" должны быть объектом типа "EqualsOptions".',
        );
    }

    for (const equalsCase of EqualsPipelineDefault) {
        let o = options;

        if (
            equalsCase.descriptor?.options &&
            typeof equalsCase.descriptor?.parseOptions === 'function'
        ) {
            o = equalsCase.descriptor.parseOptions(o);
        }

        if (equalsCase.guard(a, b, o)) {
            return equalsCase.compare(a, b, o);
        }
    }

    return false;
}

/**
 * Сравнивает два значения как примитивы с учётом выбранного режима —
 * строгого или «слабого» сравнения.
 *
 * По умолчанию используется строгая проверка через `Object.is`, которая:
 *
 * - отличает `+0` и `-0` (`Object.is(+0, -0) === false`),
 * - считает `NaN` равным самому себе (`Object.is(NaN, NaN) === true`),
 * - для всех остальных случаев работает как строгое равенство по ссылке/значению.
 *
 * Если включён режим `loose` (`loose: true`), используется оператор `==`:
 *
 * - `1 == '1'` → `true`
 * - `true == 1` → `true`
 * - `null == undefined` → `true`
 * - но `NaN == NaN` остаётся `false`
 *
 * Эта функция предназначена для проверки равенства примитивов и
 * боксированных значений на базовом уровне. Для структурных объектов
 * (массивов, карт, сетов) применяются отдельные алгоритмы сравнения.
 *
 * @param a Первое сравниваемое значение.
 * @param b Второе сравниваемое значение.
 * @param loose Включает «слабое» сравнение через `==` (по умолчанию `false`).
 * @returns `true`, если значения равны в выбранном режиме, иначе `false`.
 *
 * @example
 * ```ts
 * equals.primitive(1, 1);            // true
 * equals.primitive(NaN, NaN);        // true
 * equals.primitive(+0, -0);          // false
 *
 * equals.primitive(1, '1');          // false
 * equals.primitive(1, '1', true);    // true
 *
 * equals.primitive(null, undefined);       // false
 * equals.primitive(null, undefined, true); // true
 * ```
 */
equals.primitive = equalsPrimitive;

/**
 * Стандартный пайплайн кейсов для {@link equals}.
 *
 * Порядок кейсов подобран для производительности и предсказуемой семантики:
 *
 * 1) Быстрые/шорткат-проверки:
 *
 *    - {@link EqualsFastCase} — `Object.is` (ловит `NaN~NaN`, различает `+0/-0`, тождество ссылок);
 *    - {@link EqualsLooseCase} — опциональное `==` для простых совпадений;
 *    - {@link EqualsNullCase}  — асимметричный `null` (если один `null` → false);
 *    - {@link EqualsBoxedCase} — `new String/Number/Boolean` по их примитивному значению;
 *    - {@link EqualsNotObjectCase} — если один из операндов не объект → false (после fast/loose/boxed).
 *
 * 2) Структурные предикаты/узкие типы:
 *
 *    - {@link EqualsPrototypeCase} — разные прототипы объектов → false;
 *    - {@link EqualsDateCase}, {@link EqualsRegExpCase};
 *    - бинарные буферы/представления: {@link EqualsArrayBufferCase}, {@link EqualsDataViewCase};
 *    - {@link EqualsTypedArrayCase} — все TypedArray, включая BigInt-варианты;
 *    - коллекции/структуры: {@link EqualsArrayCase}, {@link EqualsSetCase}, {@link EqualsMapCase}.
 *
 * 3) Неитерируемые/идентичность-только и узкие сущности:
 *
 *    - {@link EqualsWeakSetCase}, {@link EqualsWeakMapCase}, {@link EqualsFunctionCase}, {@link EqualsPromiseCase}
 *      — содержательная проверка невозможна/неопределенна, равны только по ссылке (перехватывает FastCase).
 *    - {@link EqualsErrorCase} — сравнение `name/message` и при `deep` — `cause`;
 *    - {@link EqualsURLCase} — сравнение по нормализованному `href`;
 *    - {@link EqualsURLSearchParamsCase} — мультимножество пар `[key,value]`, порядок не важен.
 *
 * 4) Завершающий кейс:
 *
 *    - {@link EqualsPlainObjectCase} — структурное сравнение plain-объектов
 *      (ключи, опционально дескрипторы, значения рекурсивно при `deep/depth`).
 *
 * Пайплайн заморожен (`Object.freeze`) и рассчитан на использование как «дефолтный» набор правил.
 */
equals.pipeline = EqualsPipelineDefault;

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
equals.cases = EqualsPipelineCases;

export default equals;
