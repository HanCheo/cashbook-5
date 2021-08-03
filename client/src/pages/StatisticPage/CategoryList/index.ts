import Component from "@/src/core/Component";
import { html } from "@/src/utils/codeHelper";
import "./index.scss";

interface IState { }

interface IProps {
    items?: CategoryItem[],
}

export interface CategoryItem {
    name: string,
    percentage: number,
    value: number,
    color: string
}

export default class CategoryList extends Component<IState, IProps> {
    template() {
        const { items } = this.$props;
        const totalCost = items ? items.reduce((acc, curr) => { return acc + curr.value }, 0) : 0;
        return html`
            <div class="category-container">
                <h1 class="category-container--title">이번 달 지출 금액 ${totalCost} 원</h1>
                <ul class="category-container--list">
                    ${items && items.map(item => html`
                        <li class="category-container--list--item">
                            <div class="category" style="background-color:${item.color}"><span>${item.name}</span></div>
                            <div class="percentage">${item.percentage}%</div>
                            <div class="cost">${item.value}원</div>
                        </li>
                        `).join("")}
                </ul>
            </div>
        `;
    }
}