import Component from '@/src/interfaces/Component';
import './header.scss';

export default class Header extends Component {
  template() {
    return `
        <div class="hader-wrap">
          <div class="title">우아한 가계부</div>
          <div class="main">7월</div>
          <div class="icons">아이콘</div>
        </div>
      `;
  }
}
