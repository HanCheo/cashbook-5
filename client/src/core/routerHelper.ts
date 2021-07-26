import { ClassElement } from 'typescript';

export function isPromise(value: Promise<Function>) {
  return Boolean(value && typeof value.then === 'function');
}

export function isFunction(value: Function) {
  return Boolean(value && typeof value === 'function');
}

export function isClass(value: ClassElement) {
  return Boolean(value && value.toString().startsWith('class '));
}
