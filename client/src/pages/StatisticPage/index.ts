import { getStatisticLedgers, StatisticLedgerByCategory } from '@/src/api/statisticAPI';
import Component from '@/src/core/Component';
import { qs } from "@/src/utils/selectHelper";
import LineChart, { LineChartData, LineGroupChartData } from '@/src/utils/charts/LineChart';
import PieChart, { PieChartData } from '@/src/utils/charts/PieChart';
import CategoryList, { CategoryItem } from './CategoryList';
import './index.scss';
import { html } from '@/src/utils/codeHelper';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { removeAllChildNode } from '@/src/utils/domHelper';

interface IState {
  statisticData?: StatisticLedgerByCategory;
  categoryItems?: CategoryItem[];
}
interface IProps { }

export default class StatisticPage extends Component<IState, IProps> {
  template() {
    return /* html */`
            <div class='statistic-container'>
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
            </div>
          `;
  }

  setup() {
    this.$state = { statisticData: {} };

    getStatisticLedgers().then(result => {
      if (result.success) {
        const statisticData = result.data;

        this.setState({
          statisticData: statisticData,
          categoryItems: mapToCategoryItemData(statisticData)
        });
      }
    });
  }

  mounted() {
    const { categoryItems } = this.$state;
    const $categoryList = qs("#statistic-category-container") as HTMLElement;
    new CategoryList($categoryList, { items: categoryItems });

    const $lineChartResetBtn = qs("#reset-line-chart-btn") as HTMLElement;
    $lineChartResetBtn.addEventListener("click", () => {
      this.renderLineChartAllCategory();
    });

    this.renderPieChart();
    this.renderLineChartAllCategory();
  }

  renderPieChart() {
    const { statisticData } = this.$state;
    const $pieChartContainer = document.querySelector('#pie-chart') as HTMLElement;
    if (!statisticData) {
      $pieChartContainer.innerHTML = html`<p>데이터가 없습니다.</p>`;
    } else {
      const pieChartData = mapToPieChartData(statisticData);
      removeAllChildNode($pieChartContainer);

      const $pieChartSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGElement;
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

    if (!statisticData) {
      $lineChartContainer.innerHTML = html`<p>데이터가 없습니다.</p>`;
    } else {
      const lineChartData = mapToLineChartData(statisticData)
      this.renderLineChart(lineChartData);
    }
  }

  renderLineChartByCategory(category: string) {
    const { statisticData } = this.$state;
    const $lineChartContainer = document.querySelector('#line-chart') as HTMLElement;
    removeAllChildNode($lineChartContainer);

    if (!statisticData) {
      $lineChartContainer.innerHTML = html`<p>데이터가 없습니다.</p>`;
    } else {
      let categortAsKey: keyof StatisticLedgerByCategory = category;
      const filtered: StatisticLedgerByCategory = {
        [category]: statisticData[categortAsKey]
      }
      const lineChartData = mapToLineChartData(filtered);
      this.renderLineChart(lineChartData);
    }
  }

  renderLineChart(lineChartData: LineGroupChartData) {
    const $lineChartContainer = document.querySelector('#line-chart') as HTMLElement;
    const $lineChartSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGElement;
    LineChart.init($lineChartSVG, lineChartData);
    $lineChartContainer.appendChild($lineChartSVG);
  }
}

function mapToCategoryItemData(data: StatisticLedgerByCategory): CategoryItem[] {
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
          datetime: entry.datetime,
          value: entry.value,
        };
      }),
      color,
    };
  }

  return lineGroupChartData;
}