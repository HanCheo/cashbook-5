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

export const svgCircle = (x: number, y: number, r: number) => {
  const $circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  $circle.setAttribute('cx', `${x}`);
  $circle.setAttribute('cy', `${y}`);
  $circle.setAttribute('r', `${r}`);
  return $circle;
};

export type Point = [number, number];

export const svgPath = (points: Point[]) => {
  const $path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  // M113,360 L113,192 L259,171 L405,179 L551,200 L697,204 L697,360 Z
  const pathData = [];
  if (points.length > 0) {
    const x = points[0][0];
    const y = points[0][1];
    const start = `M${x},${y}`;
    pathData.push(start);
    points.slice(1).forEach(point => {
      const x = point[0],
        y = point[1];
      pathData.push(`L${x},${y}`);
    });
  }

  $path.setAttribute('d', pathData.join(' '));
  return $path;
};
