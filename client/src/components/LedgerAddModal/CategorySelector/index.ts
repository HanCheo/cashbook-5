import Component from '@/src/core/Component';
import { ICategoryItem } from '@/src/interfaces/Category';
import './index.scss';

interface IState {}

interface IProps {
  categories: ICategoryItem[];
  onClickCategory: (d: number) => void;
}

export default class CategorySelector extends Component<IState, IProps> {
  public isShowCategories: boolean = false;

  // TODO: property를 통해서 category list 와 색깔 정보를 얻어와야합니다.
  template() {
    const { categories } = this.$props;
    return /* html */ `
    <div class="category-selector">
        <div class="category-selector--toggle"> 선택 </div>
        <ul class="category-selector--list">
           ${categories
             ?.map(
               (category: ICategoryItem) => /* html */ `
                    <li class="category-selector--list--item" data-category="${category.id}">${category.name}</li>
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
    const $toggleElement = this.$target.querySelector('.category-selector--toggle') as HTMLElement;

    // Add eventListener for toggle button click event
    $toggleElement.addEventListener('mousedown', e => this.handleToggleClickEvent());

    // Add eventListener for focuse out click event
    window.addEventListener('click', e => this.handleFocusOutClickEvent(e));

    // Add eventListener for clicking categoryItem
    this.$target.addEventListener('click', e => this.handleCategoryItemClickEvent(e));
  }

  handleCategoryItemClickEvent(e: MouseEvent) {
    const { onClickCategory } = this.$props;

    const target = e.target as HTMLElement;

    const itemElements = this.$target.querySelectorAll('.category-selector--list--item');
    for (const itemElement of Array.from(itemElements)) {
      if (target === itemElement) {
        const { category } = target.dataset;
        if (category) {
          onClickCategory(Number(category));
          this.toggleCategoryList(false);
        }
      }
    }
  }

  handleFocusOutClickEvent(e: MouseEvent) {
    const eventTargetElement = e.target;

    const $toggleElement = this.$target.querySelector('.category-selector--toggle');
    if ($toggleElement === eventTargetElement) {
      return;
    }
    const $listElement = this.$target.querySelector('.category-selector--list');
    if ($listElement === eventTargetElement) {
      return;
    }

    const childElements = this.$target.querySelectorAll('.category-selector--list--item');
    for (const element of Array.from(childElements)) {
      if (eventTargetElement === element) {
        return;
      }
    }
    this.toggleCategoryList(false);
  }

  handleToggleClickEvent() {
    this.toggleCategoryList(!this.isShowCategories);
  }

  toggleCategoryList(flag = false) {
    const $selectorList = this.$target.querySelector('.category-selector--list') as HTMLElement;
    $selectorList.style.display = flag ? 'block' : 'none';
    this.isShowCategories = flag;
  }
}
