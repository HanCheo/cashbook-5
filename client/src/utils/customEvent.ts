export const emitCustomEvent = (eventType: string, detail?: object): void => {
  document.dispatchEvent(
    new CustomEvent(eventType, {
      detail,
    })
  );
};
export const listen = (type: string, listener: EventListenerOrEventListenerObject): void => {
  document.addEventListener(type, listener);
};
