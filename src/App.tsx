import styles from './app.module.scss';

import { useContext } from 'react';

import { MessageList } from './components/MessageList/intex';
import { LoginBox } from './components/LoginBox/index';
import { AuthContext } from './contexts/auth';
import { SendMessageForm } from './components/SendMessageForm';


export function App() {
  // Pagina restrita ao usuario autenticado.
  const { user } = useContext(AuthContext);

  //----------------------------------------
  return (
    <main className={styles.contentWrapper}>
      <MessageList />

      {/* Estou falando:
      se boolean(user) for verdadeiro mostre <Send... /> se for falso mostre <LoginBox /> */}
      { Boolean(user) ? <SendMessageForm /> : <LoginBox /> }
    </main>
  )
}

