import Component from '@/src/core/Component';
import './index.scss';

interface IState {}

interface IProps {}

export default class WalletPage extends Component<IState, IProps> {
  template() {
    return `
        <h1>Your Wallet</h1>
    `;
  }
}
