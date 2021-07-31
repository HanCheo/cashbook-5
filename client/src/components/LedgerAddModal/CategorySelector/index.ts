import './index.scss';
import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import { ICategoryItem } from '@/src/interfaces/Category';
import { qs, qsAll } from '@/src/utils/selecthelper';

interface IState {
  isShowCategories: boolean;
}

interface IProps {
  categories: ICategoryItem[];
  onClickCategory: (value: string) => void;
}

export default class CategorySelector extends Component<IState, IProps> {
  setup() {
    this.$state = { isShowCategories: false };
  }

  // TODO: property를 통해서 category list 와 색깔 정보를 얻어와야합니다.
  template() {
    const { categories } = this.$props;
    return html`
      <div class="category-selector">
        <div class="category-selector--toggle">선택</div>
        <ul class="category-selector--list">
          ${categories
            ?.map(
              (category: ICategoryItem) => /* html */ `
                    <li class="category-selector--list--item ledger-category"
                    data-category="${category.name}" data-category-type="${category.id}">${category.name}</li>
                `
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  mounted() {
    this.bindingEvents();
  }

  bindingEvents() {
    const $toggleElement = qs('.category-selector--toggle', this.$target) as HTMLElement;

    // Add eventListener for toggle button click event
    $toggleElement.addEventListener('click', e => this.handleToggleClickEvent());

    // Add eventListener for focuse out click event
    window.addEventListener('click', e => this.handleFocusOutClickEvent(e));

    // Add eventListener for clicking categoryItem
    this.$target.addEventListener('click', e => this.handleCategoryItemClickEvent(e));
  }

  handleCategoryItemClickEvent(e: MouseEvent) {
    const { onClickCategory } = this.$props;

    const target = e.target as HTMLElement;

    const itemElements = qsAll('.category-selector--list--item', this.$target);
    for (const itemElement of Array.from(itemElements)) {
      if (target === itemElement) {
        const { category } = target.dataset;
        if (category) {
          onClickCategory(category);
          this.toggleCategoryList(false);
        }
      }
    }
  }

  handleFocusOutClickEvent(e: MouseEvent) {
    const eventTargetElement = e.target;

    const $toggleElement = qs('.category-selector--toggle', this.$target);
    if ($toggleElement === eventTargetElement) {
      return;
    }
    const $listElement = qs('.category-selector--list', this.$target);
    if ($listElement === eventTargetElement) {
      return;
    }

    const childElements = qsAll('.category-selector--list--item', this.$target);
    for (const element of Array.from(childElements)) {
      if (eventTargetElement === element) {
        return;
      }
    }
    this.toggleCategoryList(false);
  }

  handleToggleClickEvent() {
    const { isShowCategories } = this.$state;
    this.toggleCategoryList(!isShowCategories);
  }

  toggleCategoryList(flag = false) {
    const $selectorList = qs('.category-selector--list', this.$target) as HTMLElement;
    $selectorList.style.display = flag ? 'block' : 'none';
    this.$state.isShowCategories = flag;
  }
}
