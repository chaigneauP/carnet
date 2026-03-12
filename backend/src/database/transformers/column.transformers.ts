import type { ValueTransformer } from 'typeorm';

function toNullableNumber(value: unknown) {
  return value === null || value === undefined ? value : Number(value);
}

export const bigintToNumberTransformer: ValueTransformer = {
  to: (value) => value,
  from: (value) => toNullableNumber(value),
};

export const numericToNumberTransformer: ValueTransformer = {
  to: (value) => value,
  from: (value) => toNullableNumber(value),
};

