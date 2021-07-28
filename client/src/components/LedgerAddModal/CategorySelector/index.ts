import Component from '@/src/core/Component';
import './index.scss';

export default class CategorySelector extends Component {
  public isShowCategories: boolean = false;

  // TODO: property를 통해서 category list 와 색깔 정보를 얻어와야합니다.
  template() {
    return /* html */ `
    <div class="category-selector">
        <div class="category-selector--toggle"> 더보기 </div>
        <ul class="category-selector--list">
            <li class="category-selector--list--item">취미</li>
            <li class="category-selector--list--item">적금</li>
            <li class="category-selector--list--item">월급</li>
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

    // TODO: add delegator event for item click event
  }

  handleFocusOutClickEvent(e: MouseEvent) {
    const eventTargetElement = e.target;

    const $toggleElement = this.$target.querySelector('.category-selector--toggle');
    if ($toggleElement === eventTargetElement) {
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
