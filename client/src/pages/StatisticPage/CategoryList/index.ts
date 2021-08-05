import Component from '@/src/core/Component';
import CalendarModel from '@/src/models/Calendar';
import { addComma, html } from '@/src/utils/codeHelper';
import { qs, qsAll } from '@/src/utils/selectHelper';
import './index.scss';

interface IState {}

interface IProps {
  items?: CategoryListItem[];
  onClickItem: (name: string) => void;
}

export interface CategoryListItem {
  name: string;
  percentage: number;
  value: number;
  color: string;
}

export default class CategoryList extends Component<IState, IProps> {
  template() {
    const { items } = this.$props;
    const totalCost = items
      ? items.reduce((acc, curr) => {
          return acc + curr.value;
        }, 0)
      : 0;
    const selectDate = CalendarModel.getDate();

    return html`
      <div class="category-container">
        <h1 class="category-container--title">
          ${selectDate.getFullYear() + '년 ' + (selectDate.getMonth() + 1) + '월 지출'}
          <div><span class="minus">${addComma(totalCost)}</span> 원</div>
        </h1>
        <ul class="category-container--list">
          ${items &&
          items
            .map(
              item => html`
                <li class="category-container--list--item" data-name="${item.name}">
                  <div class="category" style="background-color:${item.color}"><span>${item.name}</span></div>
                  <div class="percentage">${item.percentage || '0.00'}%</div>
                  <div class="cost">${addComma(item.value)}원</div>
                </li>
              `
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  mounted() {
    const $categoryItemList = qs('.category-container--list', this.$target) as HTMLElement;
    $categoryItemList.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const categoryItems = qsAll('.category-container--list--item', $categoryItemList);

      for (const $categoryItem of categoryItems) {
        if ($categoryItem === target) {
          const { name } = target.dataset;
          if (name) {
            this.handleClickCategoryItem(name);
          }
        }
      }
    });
  }

  handleClickCategoryItem(name: string) {
    this.$props.onClickItem(name);
  }
}
