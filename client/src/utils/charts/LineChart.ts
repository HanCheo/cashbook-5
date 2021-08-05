import { addComma } from '../codeHelper';
import { transformer, ScaleFn } from './scale';
import { svgGroup, svgLine, svgText, svgCircle, svgLinePath, Point, svgCurveLinePath } from './svgElement';

export interface LineGroupChartData {
  [category: string]: {
    data: LineChartData[];
    color: string;
  };
}

export interface LineChartData {
  name: string;
  value: number;
  datetime: Date;
}

interface ProcessedLineGroupChartData {
  [category: string]: {
    data: ProcessedLineChartData[];
    color: string;
  };
}

interface ProcessedLineChartData {
  name: string;
  value: number;
  datetime: Date;
  milliseconds: number;
}

export interface LineChartOptions {
  [key: string]: any;
  lineAnimationDuration?: number;
  xLabelFontSize?: string;
  yLabelFontSize?: string;
  lineOpacity?: number;
  lineWidth?: number;
  showGrid?: boolean;
  countOfGap?: number;
}

const defaultOptions: LineChartOptions = {
  lineAnimationDuration: 0.4, // 0.4s
  xLabelFontSize: '1em',
  yLabelFontSize: '1em',
  lineOpacity: 0.5,
  lineWidth: 3,
  countOfGap: 3,
  showGrid: false,
  formatXLabel: null,
};

const LEFT_POS = 150;
const TOP_POS = 50;
const BOTTOM_POS = 420;
const RIGHT_POS = 900;
const X_LABEL_PADDING = 40;
const Y_LABEL_PADDING = 20;
const VIEWBOX_X_OFFSET = 0;
const VIEWBOX_Y_OFFSET = 0;
const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 500;

export default class LineChart {
  public left: number;
  public top: number;
  public right: number;
  public bottom: number;

  public xLabelPadding: number = X_LABEL_PADDING;
  public yLabelPadding: number = Y_LABEL_PADDING;

  public yGridGap: number = 0;
  public yGridGapCount: number = 0;

  public maxValueOfXAxis?: number = undefined;
  public minValueOfXAxis?: number = undefined;
  public maxValueOfYAxis?: number = undefined;
  public minValueOfYAxis?: number = undefined;
  public scaleX?: ScaleFn = undefined;
  public scaleY?: ScaleFn = undefined;
  public element: SVGElement;
  public options: LineChartOptions;
  public groupData?: ProcessedLineGroupChartData;

  constructor(element: SVGElement, groupData: LineGroupChartData, options = {}) {
    if (!(element instanceof Node)) {
      throw "Can't initialize PieChart because " + element + ' is not a Node.';
    }

    this.left = LEFT_POS;
    this.top = TOP_POS;
    this.right = RIGHT_POS;
    this.bottom = BOTTOM_POS;

    this.element = element;
    this.options = this.extendSetting(options);
    this.groupData = this.processData(groupData);

    this.updatePosition();
    this.renderGraph();
  }

  processData(groupData: LineGroupChartData): ProcessedLineGroupChartData {
    const newGroupData: ProcessedLineGroupChartData = {};

    for (const category in groupData) {
      const { data } = groupData[category];
      const newData: ProcessedLineChartData[] = data.map((d: LineChartData) => {
        return {
          name: d.name,
          value: d.value,
          datetime: d.datetime,
          milliseconds: d.datetime.getTime(),
        };
      });
      newGroupData[category] = {
        ...groupData[category],
        data: newData,
      };
    }

    return newGroupData;
  }

  updatePosition() {
    if (!this.groupData) {
      throw new Error('Group Data missing');
    }

    const items: ProcessedLineChartData[] = [];
    Object.values(this.groupData).forEach(entry => {
      items.push(...entry.data);
    });

    if (!items || items.length == 0) {
      this.scaleX = transformer();
      this.scaleY = transformer();
    } else {
      const milliseconds = items.map(d => d.milliseconds);
      const values = items.map(d => d.value);

      this.maxValueOfXAxis = Math.max(...milliseconds);
      this.minValueOfXAxis = Math.min(...milliseconds);
      this.maxValueOfYAxis = Math.max(...values);
      this.minValueOfYAxis = Math.min(...values);

      this.scaleX = transformer().domain(this.minValueOfXAxis, this.maxValueOfXAxis).range(this.left, this.right);
      this.scaleY = transformer().domain(this.minValueOfYAxis, this.maxValueOfYAxis).range(this.bottom, this.top);

      this.yGridGap = this.caculateGap(this.maxValueOfYAxis - this.minValueOfYAxis);
      const isFitGap = this.maxValueOfYAxis % this.yGridGap === 0;
      this.yGridGapCount = isFitGap ? this.options.countOfGap! : this.options.countOfGap! + 1;
    }
  }

  caculateGap(range: number) {
    const tempGap = Math.floor(range / this.options.countOfGap!).toString();
    const firstDigit = Number(tempGap[0]);
    const countOfDigit = tempGap.length - 1;
    return firstDigit * Math.pow(10, countOfDigit);
  }

  extendSetting(options: LineChartOptions) {
    let newOptions: LineChartOptions = {};
    let property: keyof LineChartOptions;
    for (property in defaultOptions) {
      if (property in options) {
        newOptions[property] = options[property];
      } else {
        newOptions[property] = defaultOptions[property];
      }
    }
    return newOptions;
  }

  renderGraph() {
    this.element.setAttribute('viewBox', `${VIEWBOX_X_OFFSET} ${VIEWBOX_Y_OFFSET} ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`);

    if (this.groupData) {
      Object.entries(this.groupData).map(([key, entry]) => {
        this.renderAxisGrid(entry.data);
        this.renderLines(entry.data, entry.color);
        this.renderPoints(entry.data, entry.color);
        this.renderLabels(entry.data);
      });
    }
  }

  renderAxisGrid(items: ProcessedLineChartData[]) {
    if (this.options.showGrid) {
      this.renderXAxisGrid(items);
      this.renderYAxisGrid(items);
    }
    this.renderYAxisRangeGrid();
  }

  renderYAxisRangeGrid() {
    if (!(this.scaleX && this.scaleY)) {
      throw new Error('Scale Function is undefined.');
    }
    if (this.maxValueOfYAxis) {
      const yAsixGrid = svgGroup();
      yAsixGrid.setAttribute('stroke-dasharray', '1 2');
      yAsixGrid.setAttribute('stroke-width', '1');

      for (let i = 0; i < this.yGridGapCount + 1; i++) {
        const y = this.scaleY(this.yGridGap * i);
        if (TOP_POS >= y) break;
        const line = svgLine(this.left, y, this.right, y);
        yAsixGrid.appendChild(line);
      }

      this.element.appendChild(yAsixGrid);
    }
  }

  // Deprecated
  renderXAxisGrid(items: ProcessedLineChartData[]) {
    const xAsixGrid = svgGroup();
    xAsixGrid.setAttribute('stroke', 'black');
    xAsixGrid.setAttribute('stroke-dasharray', '1 2');
    xAsixGrid.setAttribute('stroke-width', '1');

    if (!(this.scaleX && this.scaleY)) {
      throw new Error('Scale Function is undefined.');
    }

    if (items && items.length > 0) {
      for (const d of items) {
        const x = this.scaleX(d.milliseconds);
        const line = svgLine(x, this.bottom, x, this.top);
        xAsixGrid.appendChild(line);
      }
    }
    this.element.appendChild(xAsixGrid);
  }

  // Deprecated
  renderYAxisGrid(items: ProcessedLineChartData[]) {
    const yAsixGrid = svgGroup();
    // yAsixGrid.setAttribute('stroke', 'curretColor');
    yAsixGrid.setAttribute('stroke-dasharray', '1 2');
    yAsixGrid.setAttribute('stroke-width', '1');

    if (!(this.scaleX && this.scaleY)) {
      throw new Error('Scale Function is undefined.');
    }

    if (items && items.length > 0) {
      for (const d of items) {
        const y = this.scaleY(d.value);
        const line = svgLine(this.left, y, this.right, y);
        line.setAttribute('stroke', 'currentColor');
        yAsixGrid.appendChild(line);
      }
    }

    this.element.appendChild(yAsixGrid);
  }

  renderPoints(items: ProcessedLineChartData[], color = '#000000') {
    if (!(this.scaleX && this.scaleY)) {
      throw new Error('Scale Function is undefined.');
    }

    const pointGroup = svgGroup();
    if (items && items.length > 0) {
      for (const item of items) {
        const x = this.scaleX(item.milliseconds);
        const y = this.scaleY(item.value);
        const point = svgCircle(x, y, 6);
        point.setAttribute('data-value', item.name);
        point.setAttribute('fill', color);
        point.setAttribute('opacity', '0.4');
        point.addEventListener('mouseover', () => {
          point.style.opacity = '1';
          point.style.transition = `transform 0.2s 0s ease`;
        });
        point.addEventListener('mouseout', () => {
          setTimeout(() => {
            point.style.opacity = `0.2`;
            point.style.transform = '';
          }, 100);
        });
        pointGroup.appendChild(point);
      }
    }
    this.element.appendChild(pointGroup);
  }

  renderLines(items: ProcessedLineChartData[], color = '#000000') {
    if (!(this.scaleX && this.scaleY)) {
      throw new Error('Scale Function is undefined.');
    }

    const points: Point[] = [];
    const lines = svgGroup();

    lines.setAttribute('stroke', color);
    lines.setAttribute('stroke-width', this.options.lineWidth?.toString() || '3');
    lines.setAttribute('stroke-opacity', this.options.lineOpacity?.toString() || '0.5');
    lines.setAttribute('fill', 'none');

    if (items && items.length > 0) {
      for (const item of items) {
        const x = this.scaleX(item.milliseconds);
        const y = this.scaleY(item.value);
        points.push([x, y]);
      }
    }

    // const $path = svgLinePath(points.reverse());
    const $path = svgLinePath(points.reverse());

    // Line의 총 길이 구하기
    const l = $path.getTotalLength();
    $path.setAttribute('stroke-dasharray', ` 0  ${l} ${l} 0`);
    $path.setAttribute('stroke-dashoffset', `${l}`);

    const animateEl = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateEl.setAttribute('attributeType', 'XML');
    animateEl.setAttribute('attributeName', 'stroke-dashoffset');
    animateEl.setAttribute('from', '0');
    animateEl.setAttribute('to', `${l}`);
    animateEl.setAttribute('dur', `${this.options.lineAnimationDuration}`);
    animateEl.setAttribute('repeatCount', '1');
    animateEl.setAttribute('fill', 'freeze');
    $path.appendChild(animateEl);

    lines.appendChild($path);
    this.element.appendChild(lines);
  }

  renderLabels(items: ProcessedLineChartData[]) {
    this.renderXLabel(items);
    // this.renderYLabel(items);
    this.renderYRangeLabel();
  }

  renderXLabel(items: ProcessedLineChartData[]) {
    if (!(this.scaleX && this.scaleY)) {
      throw new Error('Scale Function is undefined.');
    }

    const xLabelGroup = svgGroup();
    if (items && items.length > 0) {
      for (const d of items) {
        const x = this.scaleX(d.milliseconds);
        // TODO: Add option callback function formating label;

        let label = d.datetime.getDate().toString();
        if (this.options.formatXLabel) {
          label = this.options.formatXLabel(d.datetime);
        }
        const text = svgText(x, this.bottom + this.xLabelPadding, label);
        text.setAttribute('fill', 'currentColor');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', this.options.xLabelFontSize || '');

        xLabelGroup.appendChild(text);
      }
    }

    this.element.appendChild(xLabelGroup);
  }

  // Deprecated
  renderYLabel(items: ProcessedLineChartData[]) {
    if (!(this.scaleX && this.scaleY)) {
      throw new Error('Scale Function is undefined.');
    }

    const yLabelGroup = svgGroup();
    if (items && items.length > 0) {
      for (const d of items) {
        const y = this.scaleY(d.value);
        // TODO: Add option callback function formating label;
        const text = svgText(this.left - this.yLabelPadding, y, d.value.toString());
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('fill', 'currentColor');
        text.setAttribute('font-size', this.options.yLabelFontSize || '');
        yLabelGroup.appendChild(text);
      }
    }
    this.element.appendChild(yLabelGroup);
  }

  renderYRangeLabel() {
    const yLabelGroup = svgGroup();

    if (!(this.scaleX && this.scaleY)) {
      throw new Error('Scale Function is undefined.');
    }

    if (this.maxValueOfYAxis) {
      for (let i = 0; i < this.yGridGapCount + 1; i++) {
        const value = this.yGridGap * i;
        const y = this.scaleY(value);
        if (TOP_POS >= y) break;
        const text = svgText(this.left - this.yLabelPadding, y, `${addComma(value)} 원`);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('font-size', this.options.yLabelFontSize || '');
        yLabelGroup.appendChild(text);
      }

      this.element.appendChild(yLabelGroup);
    }
  }

  static init(element: SVGElement, groupData: LineGroupChartData = {}, options: LineChartOptions = {}) {
    new LineChart(element, groupData, options);
  }
}
