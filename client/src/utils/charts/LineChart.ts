import { transformer } from './scale';
import { svgGroup, svgLine, svgText } from './svgElement';

interface ScaleFn {
  (v: number): number;
}

export interface LineChartData {
  name: string;
  value: number;
  datetime: Date;
  milliseconds?: number;
}

interface ProcessedData {
  name: string;
  value: number;
  datetime: Date;
  milliseconds: number;
}

export interface LineChartOptions {
  [key: string]: number | string | Function | null;
}

const LEFT_POS = 80;
const TOP_POS = 10;
const BOTTOM_POS = 450;
const RIGHT_POS = 750;
const VIEWBOX_X_OFFSET = 0;
const VIEWBOX_Y_OFFSET = 0;
const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 500;

export class LineChart {
  public left: number;
  public top: number;
  public right: number;
  public bottom: number;
  public xGridGap: number = 0;
  public yGridGap: number = 0;
  public xGridPadding: number = 0;
  public yGridPadding: number = 0;
  public countOfXGrid: number = 0;
  public countOfYGrid: number = 0;
  public maxValueOfXAxis?: number = undefined;
  public minValueOfXAxis?: number = undefined;
  public maxValueOfYAxis?: number = undefined;
  public minValueOfYAxis?: number = undefined;
  public scaleX?: ScaleFn = undefined;
  public scaleY?: ScaleFn = undefined;
  public element: SVGElement;
  public options: LineChartOptions;
  public data?: ProcessedData[];

  constructor(element: SVGElement, data: LineChartData[], options = {}) {
    if (!(element instanceof Node)) {
      throw "Can't initialize PieChart because " + element + ' is not a Node.';
    }

    this.left = LEFT_POS;
    this.top = TOP_POS;
    this.right = RIGHT_POS;
    this.bottom = BOTTOM_POS;

    this.element = element;
    this.options = this.extendSetting(options);
    this.data = this.processData(data);

    this.updatePosition();
    this.renderGraph();
  }

  processData(data: LineChartData[]): ProcessedData[] {
    const newData: ProcessedData[] = data.map((d: LineChartData) => {
      return {
        name: d.name,
        value: d.value,
        datetime: d.datetime,
        milliseconds: d.datetime.getTime(),
      };
    });

    return newData;
  }

  updatePosition() {
    this.xGridPadding = 0;
    this.yGridPadding = 0;

    if (!this.data || this.data.length == 0) {
      this.countOfYGrid = 1;
      this.countOfXGrid = 1;
    } else {
      const milliseconds = this.data.map(d => d.milliseconds);
      const values = this.data.map(d => d.value);

      this.maxValueOfXAxis = Math.max(...milliseconds);
      this.minValueOfXAxis = Math.min(...milliseconds);
      this.maxValueOfYAxis = Math.max(...values);
      this.minValueOfYAxis = Math.min(...values);

      this.countOfYGrid = this.data.length + 1;
      this.countOfXGrid = this.data.length + 1;

      this.scaleX = transformer().domain(this.minValueOfXAxis, this.maxValueOfXAxis).range(this.left, this.right);

      this.scaleY = transformer().domain(this.minValueOfYAxis, this.maxValueOfYAxis).range(this.bottom, this.top);

      this.xGridGap = (this.scaleX(this.maxValueOfXAxis) - this.scaleX(this.minValueOfXAxis)) / this.data.length;

      this.yGridGap = (this.scaleY(this.maxValueOfYAxis) - this.scaleY(this.minValueOfYAxis)) / this.data.length;
    }
  }

  extendSetting(options: LineChartOptions) {
    let defaultOptions: LineChartOptions = {};
    let newOptions: LineChartOptions = {};
    for (var property in defaultOptions) {
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
    this.renderAxisGrid();
  }

  renderAxisGrid() {
    this.renderXAxisGrid();
    this.renderYAxisGrid();
    // TODO: rendering data point
    // TODO: rendering labels
  }

  renderXAxisGrid() {
    const xAsixGrid = svgGroup();
    xAsixGrid.setAttribute('stroke', 'black');
    xAsixGrid.setAttribute('stroke-dasharray', '1 2');
    xAsixGrid.setAttribute('stroke-width', '1');

    for (let i = 0; i < this.countOfXGrid; i++) {
      const line = svgLine(
        this.left + i * this.xGridGap + this.xGridPadding,
        this.bottom,
        this.left + i * this.xGridGap + this.xGridPadding,
        this.top
      );
      xAsixGrid.appendChild(line);
    }
    this.element.appendChild(xAsixGrid);
  }

  renderYAxisGrid() {
    const yAsixGrid = svgGroup();
    yAsixGrid.setAttribute('stroke', 'black');
    yAsixGrid.setAttribute('stroke-dasharray', '1 2');
    yAsixGrid.setAttribute('stroke-width', '1');

    for (let i = 0; i < this.countOfYGrid; i++) {
      const line = svgLine(
        this.left,
        this.bottom + this.yGridGap * i - this.yGridPadding,
        this.right,
        this.bottom + this.yGridGap * i - this.yGridPadding
      );
      yAsixGrid.appendChild(line);
    }
    this.element.appendChild(yAsixGrid);
  }

  static init(element: SVGElement, data: LineChartData[] = [], options: LineChartOptions = {}) {
    new LineChart(element, data, options);
  }
}
