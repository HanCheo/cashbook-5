import Component from '@/src/interfaces/Component';
import PieChart from '@/src/utils/PieChart';

export default class StatisticPage extends Component {
  template() {
    return `
            <div id='statistic-container'>
                <svg id="piechart" width=300 height=400 />
            </div>
          `;
  }
  mounted() {
    const $pieChart = document.querySelector('#piechart') as HTMLElement;

    const data = [
      { name: '카드', value: 10000, color: 'Coral' },
      { name: '현금', value: 2500, color: '#00ab6b' },
      { name: '적금', value: 5000, color: '#00ab6b' },
    ];
    new PieChart($pieChart, data, {
      onClick: (d: string) => {
        console.log('click: ' + d);
      },
    });
  }
}
