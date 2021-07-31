function normalize(a: number, b: number) {
  return b - a
    ? function (x: number) {
        return (x - a) / (b - a);
      }
    : function () {
        return isNaN(b) ? NaN : 0.5;
      };
}

function interpolate(a: number, b: number) {
  // same with (b - a) * t + a
  return (t: number) => a * (1 - t) + b * t;
}

function bimap(domain: any[], range: any[]) {
  let d0 = domain[0],
    d1 = domain[1];
  let r0 = range[0],
    r1 = range[1];
  let normalizer: (n: number) => number;
  let interpolater: (t: number) => number;

  normalizer = d1 < d0 ? normalize(d1, d0) : normalize(d0, d1);
  interpolater = interpolate(r0, r1);

  return (x: number) => interpolater(normalizer(x));
}

let unit = [0, 1];

export function transformer() {
  let domain = unit;
  let range = unit;

  function rescale() {
    return scale;
  }

  function scale(x: number) {
    return bimap(domain, range)(x);
  }

  scale.domain = function (d0: number, d1: number) {
    domain = [d0, d1];
    return rescale();
  };

  scale.range = function (r0: number, r1: number) {
    range = [r0, r1];
    return rescale();
  };

  return rescale();
}
