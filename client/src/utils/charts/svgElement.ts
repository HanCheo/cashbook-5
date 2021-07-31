export const svgLine = (x1: number, y1: number, x2: number, y2: number) => {
  const $line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  $line.setAttribute('x1', `${x1}`);
  $line.setAttribute('y1', `${y1}`);
  $line.setAttribute('x2', `${x2}`);
  $line.setAttribute('y2', `${y2}`);
  return $line;
};

export const svgGroup = () => document.createElementNS('http://www.w3.org/2000/svg', 'g');

export const svgText = (x: number, y: number, text = '') => {
  const $text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  $text.setAttribute('x', x.toString());
  $text.setAttribute('y', y.toString());
  $text.textContent = text;
  return $text;
};
