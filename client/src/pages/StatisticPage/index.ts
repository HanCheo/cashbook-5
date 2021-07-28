import Component from '@/src/interfaces/Component';
import PieChart, { PiChartData } from '@/src/utils/PieChart';

import './index.scss';

// TODO: Mocking Data
const mockData: PiChartData[] = [
  { name: '카드', value: 10, color: 'Coral' },
  { name: '현금', value: 50, color: '#00ab6b' },
  { name: '적금', value: 30, color: '#00ab6b' },
  { name: '적금', value: 30, color: '#00ab6b' },
  { name: '적금', value: 30, color: '#00ab6b' },
];

interface IState {
  data?: PiChartData[];
}

export default class StatisticPage extends Component {
  template() {
    return /* html */ `
            <div class='statistic-container'>
                <svg id="piechart" class="chart-container"></svg>
                <div class="category-container">
                  <h1 class="category-container--title">이번 달 지출 금액 843,000 </h1>
                  <ul class="category-container--list">
                  ${this.$state.data
                    .map(
                      (d: any) => /*html */ `
                    <li class="category-container--list--item">
                        <div class="category" >
                          <span class="ledger-category" data-category-type="2"> ${d.name}</span>
                        </div>
                        <div class="percent">${d.value}%</div>
                        <div class="cost">${d.value}</div>
                    </li>`
                    )
                    .join('')}
                  </ul>
                </div>
            </div>
          `;
  }

  setup() {
    this.$state = { data: [] };
    // TODO: Change Real API
    setTimeout(() => {
      this.setState({
        data: mockData,
      });
    }, 300);
  }

  mounted() {
    const $pieChart = document.querySelector('#piechart') as HTMLElement;
    const { data } = this.$state;

    new PieChart($pieChart, data, {
      onClick: (d: string) => {
        console.log('click: ' + d);
      },
      radius: 100,
    });
  }
}
