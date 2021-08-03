import { getStatisticLedgers, StatisticLedgerByCategory } from '@/src/api/statisticAPI';
import Component from '@/src/core/Component';
import { qs } from "@/src/utils/selecthelper";
import LineChart, { LineChartData, LineGroupChartData } from '@/src/utils/charts/LineChart';
import PieChart, { PieChartData } from '@/src/utils/charts/PieChart';
import CategoryList, { CategoryItem } from './CategoryList';

import './index.scss';

// TODO: Mocking Data
const mockDataByCategory: PieChartData[] = [
  { name: '카드', value: 10, color: 'Coral' },
  { name: '현금', value: 50, color: '#00ab6b' },
  { name: '적금', value: 30, color: '#00ab6b' },
  { name: '적금', value: 30, color: '#00ab6b' },
  { name: '적금', value: 30, color: '#00ab6b' },
];


interface IState {
  pieChartData?: PieChartData[];
  categoryItems?: CategoryItem[];
  lineChartData?: LineGroupChartData;
}
interface IProps { }

export default class StatisticPage extends Component<IState, IProps> {
  template() {
    return /* html */`
            <div class='statistic-container'>
              <div class="chart-container">
                <svg id="pie-chart"></svg>
                <div id="statistic-category-container"></div>
              </div>
              <div class="sub-chart-container">
                <svg id="line-chart"></svg>
              </div>
            </div>
          `;
  }

  setup() {
    this.$state = { pieChartData: [], lineChartData: {} };

    getStatisticLedgers().then(result => {
      if (result.success) {
        const statisticData = result.data;

        this.setState({
          pieChartData: this.mapToPieChartData(statisticData),
          lineChartData: this.mapToLineChartData(statisticData),
          categoryItems: this.mapToCategoryItemData(statisticData)
        });
      }
    });
  }

  mounted() {
    const { pieChartData, lineChartData, categoryItems } = this.$state;

    const $categoryList = qs("#statistic-category-container") as HTMLElement;
    new CategoryList($categoryList, { items: categoryItems });

    const $pieChart = document.querySelector('#pie-chart') as SVGElement;
    PieChart.init($pieChart, pieChartData, {
      onClick: (d: string) => {
        // TODO: change line chart
        console.log('click: ' + d);
      },
    });

    const $lineChart = document.querySelector('#line-chart') as SVGElement;
    LineChart.init($lineChart, lineChartData);
  }

  mapToCategoryItemData(data: StatisticLedgerByCategory): CategoryItem[] {
    const categoryItems: CategoryItem[] = [];

    let totalOfAllCategory = 0;

    for (const key in data) totalOfAllCategory += data[key].total

    for (const [key, value] of Object.entries(data)) {
      const { total, color } = value;
      const percentage = totalOfAllCategory ? ((total / totalOfAllCategory) * 100).toFixed(1) : 0;
      categoryItems.push({
        name: key,
        color: color,
        percentage: Number(percentage),
        value: total
      });
    }
    return categoryItems;
  }
  mapToPieChartData(data: StatisticLedgerByCategory): PieChartData[] {
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

  mapToLineChartData(data: StatisticLedgerByCategory): LineGroupChartData {
    const lineGroupChartData: LineGroupChartData = {};

    for (const [key, value] of Object.entries(data)) {
      const { color, entries } = value;
      lineGroupChartData[key] = {
        data: entries.map<LineChartData>(entry => {
          return {
            name: '',
            datetime: entry.datetime,
            value: entry.value,
          };
        }),
        color,
      };
    }

    return lineGroupChartData;
  }
}
