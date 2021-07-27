const defaultOption = {
  radius: 100,
  hoverScaleRate: 1.3,
  hoverEffectSpeed: 0.5,
  viewboxWidth: 400,
  viewboxHeight: 300,
};

export interface PiChartOption {
  [key: string]: number | string | Function | null;
}

export interface PiChartData {
  name: string;
  value: number;
  color?: string;
  percent?: number;
}

export default class PieChart {
  public settings: PiChartOption = {};
  public element: HTMLElement;
  public data: PiChartData[];

  constructor(element: HTMLElement, data: PiChartData[] = [], settings: PiChartOption = {}) {
    if (!(element instanceof Node)) {
      throw "Can't initialize PieChart because " + element + ' is not a Node.';
    }
    this.element = element;
    this.settings = this.extendSetting(settings);
    this.data = this.processData(data);
    this.viewboxSetting();
    this.update();
  }

  extendSetting(settings: PiChartOption) {
    let defaultSettings: PiChartOption = {
      radius: 100,
      hoverScaleRate: 1.3,
      hoverEffectSpeed: 0.5,
      viewboxWidth: 400,
      viewboxHeight: 300,
      onClick: null,
    };

    let newSettings: PiChartOption = {};
    for (var property in defaultSettings) {
      if (property in settings) {
        newSettings[property] = settings[property];
      } else {
        newSettings[property] = defaultSettings[property];
      }
    }
    return newSettings;
  }

  viewboxSetting() {
    const width = <number>this.settings.viewboxWidth;
    const height = <number>this.settings.viewboxHeight;
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    this.element.setAttribute('viewBox', `${-1 * halfWidth} ${-1 * halfHeight} ${width} ${height}`);
  }

  processData(data: PiChartData[] = []) {
    const sumOfValues: number = data.reduce((previsous, currentData) => previsous + currentData.value, 0);

    return data.map(d => {
      d.percent = d.value / sumOfValues;
      return d;
    });
  }

  update() {
    const r = <number>this.settings.radius;
    let cumulativePercent = 0;
    this.data.forEach(entry => {
      if (entry.percent === undefined) {
        throw 'Pie Chart Percent Calculate is fail.';
      }
      const [startX, startY] = this.getCoordinatesForPercent(cumulativePercent);

      cumulativePercent += entry.percent;

      const [endX, endY] = this.getCoordinatesForPercent(cumulativePercent);

      const largeArcFlag = entry.percent > 0.5 ? 1 : 0;

      const pathData = [
        `M ${startX * r} ${startY * r}`,
        `A ${r} ${r} 0 ${largeArcFlag} 1 ${endX * r} ${endY * r}`,
        `L 0,0Z`,
      ].join(' ');

      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      pathEl.setAttribute('d', pathData);
      if (entry.color) pathEl.setAttribute('fill', entry.color);
      pathEl.setAttribute('stroke', 'white');
      pathEl.setAttribute('opacity', '0.7');

      pathEl.addEventListener('mouseover', () => {
        pathEl.style.opacity = '1';
        pathEl.style.transform = `scale(${this.settings.hoverScaleRate})`;
        pathEl.style.transition = `transform ${this.settings.hoverEffectSpeed}s 0s ease`;
      });

      pathEl.addEventListener('mouseout', () => {
        setTimeout(() => {
          pathEl.style.opacity = `0.7`;
          pathEl.style.transform = '';
        }, 100);
      });

      pathEl.setAttribute('data-name', entry.name);
      if (this.settings.onClick) {
        pathEl.addEventListener('click', (e: MouseEvent) => {
          if (e.target instanceof SVGElement) {
            const { name } = e.target.dataset;
            if (this.settings.onClick instanceof Function) {
              this.settings.onClick(name);
            }
          }
        });
      }

      this.element.appendChild(pathEl);
    });
  }

  getCoordinatesForPercent(percent: number) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }
}
