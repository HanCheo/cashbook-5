import { getStatisticLedgers, StatisticLedgerByCategory } from '@/src/api/statisticAPI';
import Component from '@/src/core/Component';
import LineChart, { LineChartData, LineGroupChartData } from '@/src/utils/charts/LineChart';
import PieChart, { PieChartData } from '@/src/utils/charts/PieChart';

import './index.scss';

// TODO: Mocking Data
const mockDataByCategory: PieChartData[] = [
  { name: '카드', value: 10, color: 'Coral' },
  { name: '현금', value: 50, color: '#00ab6b' },
  { name: '적금', value: 30, color: '#00ab6b' },
  { name: '적금', value: 30, color: '#00ab6b' },
  { name: '적금', value: 30, color: '#00ab6b' },
];

const mockDataByDate: LineGroupChartData = {
  적금: {
    data: [
      {
        name: 'A',
        datetime: new Date('2021-07-21'),
        value: 10,
      },
      {
        name: 'B',
        datetime: new Date('2021-07-22'),
        value: 30,
      },
      {
        name: 'B',
        datetime: new Date('2021-07-24'),
        value: 50,
      },
    ],
    color: '#ff0000',
  },
  예금: {
    data: [
      {
        name: 'C',
        datetime: new Date('2021-07-21'),
        value: 50,
      },
      {
        name: 'D',
        datetime: new Date('2021-07-22'),
        value: 40,
      },
      {
        name: 'D',
        datetime: new Date('2021-07-23'),
        value: 50,
      },
      {
        name: 'D',
        datetime: new Date('2021-07-24'),
        value: 5,
      },
    ],
    color: '#00ff00',
  },
  현금: {
    data: [
      {
        name: 'A',
        datetime: new Date('2021-07-21'),
        value: 10,
      },
      {
        name: 'B',
        datetime: new Date('2021-07-22'),
        value: 24,
      },
      {
        name: 'B',
        datetime: new Date('2021-07-24'),
        value: 30,
      },
    ],
    color: '#000000',
  },
};

interface IState {
  pieChartData?: PieChartData[];
  lineChartData?: LineGroupChartData;
}
interface IProps {}

export default class StatisticPage extends Component<IState, IProps> {
  template() {
    return /* html */ `
            <div class='statistic-container'>
              <div class="chart-container">
                <svg id="pie-chart"></svg>
                <div class="category-container">
                  <h1 class="category-container--title">이번 달 지출 금액 843,000 </h1>
                </div>
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
        });
      }
    });
  }

  mounted() {
    const $pieChart = document.querySelector('#pie-chart') as SVGElement;
    const { pieChartData, lineChartData } = this.$state;
    PieChart.init($pieChart, pieChartData, {
      onClick: (d: string) => {
        // TODO: change line chart
        console.log('click: ' + d);
      },
    });

    const $lineChart = document.querySelector('#line-chart') as SVGElement;
    LineChart.init($lineChart, lineChartData);
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
