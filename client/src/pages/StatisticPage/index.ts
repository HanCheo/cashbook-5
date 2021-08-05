import './index.scss';
import Component from '@/src/core/Component';
import { qs } from '@/src/utils/selectHelper';
import { html } from '@/src/utils/codeHelper';
import PieChart, { PieChartData } from '@/src/utils/charts/PieChart';
import CategoryList, { CategoryListItem } from './CategoryList';

import calendarDataModel from '@/src/models/Calendar';
import LineChart, { LineChartData, LineGroupChartData } from '@/src/utils/charts/LineChart';
import { removeAllChildNode } from '@/src/utils/domHelper';
import { getStatisticLedgers, StatisticLedgerByCategory } from '@/src/api/statisticAPI';
import Snackbar from '@/src/components/SnackBar';

const CALENDAR_OBSERVER_LISTENER_KEY = 'statistic';

interface IState {
  statisticData?: StatisticLedgerByCategory;
}
interface IProps {}

export default class StatisticPage extends Component<IState, IProps> {
  template() {
    const { statisticData } = this.$state;
    return html`
      <div class="statistic-container">
        ${!statisticData || Object.keys(statisticData).length === 0
          ? html` <div class="no-data">No Spand Data</div>`
          : html`
              <div class="chart-container">
                <div id="pie-chart"></div>
                <div id="statistic-category-container"></div>
              </div>
              <div class="sub-chart-container">
                <div class="sub-chart-container--header">
                  <div id="reset-line-chart-btn" class="reset-btn">전체 데이터 보기</div>
                </div>
                <div id="line-chart"></div>
              </div>
            `}
      </div>
    `;
  }

  setup() {
    this.$state = { statisticData: {} };

    const calendarDate = calendarDataModel.getDate();
    getStatisticLedgers(calendarDate).then(result => {
      if (result.success) {
        const statisticData = result.data;
        this.setState({
          statisticData: statisticData,
        });
      }
    });
  }

  mounted() {
    if (!this.$state.statisticData || Object.keys(this.$state.statisticData).length === 0) return;
    const $lineChartResetBtn = qs('#reset-line-chart-btn') as HTMLElement;
    $lineChartResetBtn.addEventListener('click', () => {
      this.renderLineChartAllCategory();
    });

    this.renderCategoryList();
    this.renderPieChart();
    this.renderLineChartAllCategory();
  }

  renderCategoryList() {
    const { statisticData } = this.$state;
    const $categoryList = qs('#statistic-category-container') as HTMLElement;
    const items = statisticData ? mapToCategoryItemData(statisticData) : [];

    new CategoryList($categoryList, {
      items,
      onClickItem: (category: string) => {
        this.renderLineChartByCategory(category);
      },
    });
  }

  renderPieChart() {
    const { statisticData } = this.$state;
    const $pieChartContainer = document.querySelector('#pie-chart') as HTMLElement;
    if (statisticData) {
      const pieChartData = mapToPieChartData(statisticData);
      removeAllChildNode($pieChartContainer);
      const $pieChartSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement;
      $pieChartContainer.appendChild($pieChartSVG);
      PieChart.init($pieChartSVG, pieChartData, {
        onClick: (name: string) => {
          this.renderLineChartByCategory(name);
        },
      });
    }
  }

  renderLineChartAllCategory() {
    const { statisticData } = this.$state;
    const $lineChartContainer = document.querySelector('#line-chart') as HTMLElement;
    removeAllChildNode($lineChartContainer);

    if (statisticData) {
      const lineChartData = mapToLineChartData(statisticData);
      this.renderLineChart(lineChartData);
    }
  }

  renderLineChartByCategory(category: string) {
    const { statisticData } = this.$state;
    const $lineChartContainer = document.querySelector('#line-chart') as HTMLElement;
    removeAllChildNode($lineChartContainer);

    if (statisticData) {
      let categortAsKey: keyof StatisticLedgerByCategory = category;
      const filtered: StatisticLedgerByCategory = {
        [category]: statisticData[categortAsKey],
      };
      const lineChartData = mapToLineChartData(filtered);
      this.renderLineChart(lineChartData);
    }
  }

  renderLineChart(lineChartData: LineGroupChartData) {
    const $lineChartContainer = document.querySelector('#line-chart') as HTMLElement;
    const $lineChartSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement;
    LineChart.init($lineChartSVG, lineChartData);
    $lineChartContainer.appendChild($lineChartSVG);
  }

  async CalendarModelSubscribeFunction() {
    const calendarDate = calendarDataModel.getDate();
    getStatisticLedgers(calendarDate).then(result => {
      if (result.success) {
        const statisticData = result.data;

        if (!statisticData || !Object.keys(statisticData).length) {
          new Snackbar(document.body, { text: '데이터가 없어요...' });
        }
        this.setState({
          statisticData: statisticData,
        });
      }
    });
  }

  setUnmount() {
    calendarDataModel.unsubscribe(CALENDAR_OBSERVER_LISTENER_KEY);
  }
  setEvent() {
    calendarDataModel.subscribe(CALENDAR_OBSERVER_LISTENER_KEY, this.CalendarModelSubscribeFunction.bind(this));
    this.resetEvent();
  }
}

function mapToCategoryItemData(data: StatisticLedgerByCategory): CategoryListItem[] {
  const categoryItems: CategoryListItem[] = [];
  let totalOfAllCategory = 0;

  for (const key in data) totalOfAllCategory += data[key].total;

  for (const [key, value] of Object.entries(data)) {
    const { total, color } = value;
    const percentage = totalOfAllCategory ? Number(((total / totalOfAllCategory) * 100).toFixed(1)) : 0;
    categoryItems.push({
      name: key,
      color: color,
      percentage,
      value: total,
    });
  }
  return categoryItems;
}

function mapToPieChartData(data: StatisticLedgerByCategory): PieChartData[] {
  const pieChartData: PieChartData[] = [];
  for (const [key, value] of Object.entries(data)) {
    const { total, color } = value;
    pieChartData.push({
      name: key,
      value: total,
      color: color,
    });
  }
  return pieChartData;
}

function mapToLineChartData(data: StatisticLedgerByCategory): LineGroupChartData {
  const lineGroupChartData: LineGroupChartData = {};

  for (const [key, value] of Object.entries(data)) {
    const { color, entries } = value;
    lineGroupChartData[key] = {
      data: entries.map<LineChartData>(entry => {
        return {
          name: '',
          datetime: new Date(entry.datetime),
          value: entry.amount,
        };
      }),
      color,
    };
  }

  return lineGroupChartData;
}
