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

export const svgLinePath = (points: Point[]) => {
  const $path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  const pathData: string[] = [];
  if (points.length > 0) {
    points.forEach((point, idx) => {
      const x = point[0];
      const y = point[1];

      if (idx === 0) {
        pathData.push(`M${x},${y}`);
        return;
      }

      pathData.push(`L${x},${y}`);
    });
  }

  $path.setAttribute('d', pathData.join(' '));
  return $path;
};

export const svgCurveLinePath = (points: Point[]) => {
  const getControlPoint = generateControlPointFn(0.25);

  const $path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  const pathData: string[] = [];

  points.forEach((point, idx, array) => {
    const x = point[0];
    const y = point[1];

    if (idx === 0) {
      pathData.push(`M${x},${y}`);
      return;
    }

    const [cpsX, cpsY] = getControlPoint(array[idx - 2], array[idx - 1], point);
    const [cpeX, cpeY] = getControlPoint(array[idx - 1], point, array[idx + 1], true);
    pathData.push(`C ${cpsX}, ${cpsY} ${cpeX}, ${cpeY} ${x}, ${y}`);
  })


  $path.setAttribute("d", pathData.join(' '));
  return $path;
}


function getOpposedLine(pointA: Point, pointB: Point) {
  const xLength = pointB[0] - pointA[0];
  const yLength = pointB[1] - pointA[1];

  const zLength = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));
  const angle = Math.atan2(yLength, xLength); // angle by x-asix using basis vector
  return { length: zLength, angle };
}

const generateControlPointFn = (smooth: number) => {
  return function getControlPoint(prev: Point, curr: Point, next: Point, isEndControlPoint: boolean = false): Point {
    const p = prev || curr;
    const n = next || curr;

    const smoothDegree = smooth;
    const o = getOpposedLine(p, n);

    const angle = o.angle + (isEndControlPoint ? Math.PI : 0);
    const length = o.length * smoothDegree;

    const x = curr[0] + Math.cos(angle) * length;
    const y = curr[1] + Math.sin(angle) * length;
    return [x, y];
  }
}

