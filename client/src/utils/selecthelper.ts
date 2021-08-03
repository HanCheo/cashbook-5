export const qs = (selector: string, target: HTMLElement | Document = document) => {
  return target.querySelector(selector);
};

export const qsAll = (selector: string, target: HTMLElement | Document = document) => {
  return target.querySelectorAll(selector);
};

