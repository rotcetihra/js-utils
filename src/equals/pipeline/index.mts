import {
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
    equals,
    type EqualsPipeline,
} from '@/index.mjs';

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
const PipelineDefault: EqualsPipeline = Object.freeze([
    EqualsFastCase,
    EqualsLooseCase,
    EqualsNullCase,
    EqualsBoxedCase,
    EqualsNotObjectCase,
    EqualsPrototypeCase,
    EqualsDateCase,
    EqualsRegExpCase,
    EqualsArrayBufferCase,
    EqualsDataViewCase,
    EqualsTypedArrayCase,
    EqualsArrayCase,
    EqualsSetCase,
    EqualsMapCase,
    EqualsWeakSetCase,
    EqualsWeakMapCase,
    EqualsFunctionCase,
    EqualsPromiseCase,
    EqualsErrorCase,
    EqualsURLCase,
    EqualsURLSearchParamsCase,
    EqualsPlainObjectCase,
] as const);

export default PipelineDefault;
