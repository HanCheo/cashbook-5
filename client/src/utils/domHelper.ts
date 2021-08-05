export const removeAllChildNode = (element: HTMLElement) => {
    let parentNode = element;
    while (parentNode.hasChildNodes()) {
        const child = parentNode.firstChild;
        if (child) parentNode.removeChild(child);
    }
}