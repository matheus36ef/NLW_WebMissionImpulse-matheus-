import styles from './app.module.scss';

import { MessageList } from './components/MessageList/intex';
import { LoginBox } from './components/LoginBox/index';


export function App() {
  return (
    <main className={styles.contentWrapper}>
      <MessageList />
      <LoginBox />
    </main>
  )
}

