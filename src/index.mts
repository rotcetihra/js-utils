/**
 * @packageDocumentation
 *
 * Главный entrypoint пакета `@rotcetihra/utils`.
 *
 * Здесь собраны:
 * - Типы для построения собственных пайплайнов сравнения;
 * - Предопределённые кейсы и дефолтный пайплайн;
 * - Хелперы (`equalsPrimitive`, `equalsCreateCase` и т.д.);
 * - Основная функция {@link equals}.
 */

// ----------------- Типы -----------------
export type { CaseGuardPredicate as EqualsCaseGuardPredicate } from '@/equals/types/CaseGuardPredicate.mjs';
export type { CaseComparePredicate as EqualsCaseComparePredicate } from '@/equals/types/CaseComparePredicate.mjs';
export type { Pipeline as EqualsPipeline } from '@/equals/types/Pipeline.mjs';
export type { Case as EqualsCase } from '@/equals/contracts/Case.mjs';
export type { CaseDescriptor as EqualsCaseDescriptor } from '@/equals/contracts/CaseDescriptor.mjs';
export type { Options as EqualsOptions } from '@/equals/contracts/Options.mjs';

// ----------------- is-функции -----------------
export { default as isBoxedBoolean } from '@/is/isBoxedBoolean.mjs';
export { default as isBoxedNumber } from '@/is/isBoxedNumber.mjs';
export { default as isBoxedString } from '@/is/isBoxedString.mjs';

// ----------------- Кейсы -----------------
export { default as EqualsFastCase } from '@/equals/pipeline/cases/FastCase.mjs';
export { default as EqualsLooseCase } from '@/equals/pipeline/cases/LooseCase.mjs';
export { default as EqualsNullCase } from '@/equals/pipeline/cases/NullCase.mjs';
export { default as EqualsBoxedCase } from '@/equals/pipeline/cases/BoxedCase.mjs';
export { default as EqualsNotObjectCase } from '@/equals/pipeline/cases/NotObjectCase.mjs';
export { default as EqualsPrototypeCase } from '@/equals/pipeline/cases/PrototypeCase.mjs';
export { default as EqualsDateCase } from '@/equals/pipeline/cases/DateCase.mjs';
export { default as EqualsRegExpCase } from '@/equals/pipeline/cases/RegExpCase.mjs';
export { default as EqualsArrayBufferCase } from '@/equals/pipeline/cases/ArrayBufferCase.mjs';
export { default as EqualsDataViewCase } from '@/equals/pipeline/cases/DataViewCase.mjs';
export { default as EqualsTypedArrayCase } from '@/equals/pipeline/cases/TypedArrayCase.mjs';
export { default as EqualsArrayCase } from '@/equals/pipeline/cases/ArrayCase.mjs';
export { default as EqualsSetCase } from '@/equals/pipeline/cases/SetCase.mjs';
export { default as EqualsMapCase } from '@/equals/pipeline/cases/MapCase.mjs';
export { default as EqualsWeakSetCase } from '@/equals/pipeline/cases/WeakSetCase.mjs';
export { default as EqualsWeakMapCase } from '@/equals/pipeline/cases/WeakMapCase.mjs';
export { default as EqualsFunctionCase } from '@/equals/pipeline/cases/FunctionCase.mjs';
export { default as EqualsPromiseCase } from '@/equals/pipeline/cases/PromiseCase.mjs';
export { default as EqualsErrorCase } from '@/equals/pipeline/cases/ErrorCase.mjs';
export { default as EqualsURLCase } from '@/equals/pipeline/cases/URLCase.mjs';
export { default as EqualsURLSearchParamsCase } from '@/equals/pipeline/cases/URLSearchParamsCase.mjs';
export { default as EqualsPlainObjectCase } from '@/equals/pipeline/cases/PlainObjectCase.mjs';

// ----------------- Пайплайн -----------------
export { default as EqualsPipelineDefault } from '@/equals/pipeline/index.mjs';
export { default as EqualsPipelineCases } from '@/equals/pipeline/cases/index.mjs';

// ----------------- Хелперы -----------------
export { default as equalsCreateDescriptor } from '@/equals/helpers/createDescriptor.mjs';
export { default as equalsCreateCase } from '@/equals/helpers/createCase.mjs';
export { default as equalsParseOptions } from '@/equals/helpers/parseOptions.mjs';
export { default as equalsPrimitive } from '@/equals/helpers/primitive.mjs';

// ----------------- Главная функция -----------------
export { default as equals } from '@/equals/index.mjs';
