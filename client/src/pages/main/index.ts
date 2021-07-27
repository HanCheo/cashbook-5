import LedgerBody from '@/src/components/LedgerBody';
import Component from '@/src/interfaces/Component';
export default class Main extends Component {
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
