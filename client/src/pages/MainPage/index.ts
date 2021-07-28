import LedgerBody from '@/src/components/LedgerContainer';
import Component from '@/src/core/Component';

export default class MainPage extends Component {
  template() {
    return `
        <div id='body'></div>
      `;
  }

  mounted() {
    const body = this.$target.querySelector('#body') as HTMLElement;
    new LedgerBody(body);
  }
}
