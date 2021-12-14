import styles from './styles.module.scss';
import { VscSignOut } from 'react-icons/vsc';
import { VscGithubInverted } from 'react-icons/vsc';

import { useContext, useState, FormEvent } from 'react';
import { AuthContext } from '../../contexts/auth'
import { api } from '../../services/api';


export function SendMessageForm() {
    const { user, signOut} = useContext(AuthContext);
    const [message, setMessage] = useState(''); // Um estado que armazena a mensagem para depois envia-la.
    
    async function handleSendMessage(event: FormEvent) { // Estamos recebendo todos os valores do onSubmit, inclusive o event, como estamos utilizanod TS, temos que definir o dado, no React temos o FormEvent
        event.preventDefault(); // Isso vai previnir um comportamento padrão de um submit do formulario HTML.
       
        if(!message.trim()) {
            return;
        }

        await api.post('messages', { message })


        setMessage('');

    }
    return (
        <div className={styles.sendMessageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32"/>
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    {/* Colocamos ? pois é possivel que o usuario esteja nulo, então com a ? ele faz uma verificação antes. */}
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16"/>
                    {user?.login}
                </span>
            </header>


            <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                <label htmlFor="message">Mensagem</label>
                <textarea 
                    name="message"
                    id="message"
                    placeholder="Qual sua expectativa para o evento?"
                    onChange={event => setMessage(event.target.value)} //Toda vez que o text desse textarea mudar, vamos {event => setMessage(event.target.value)}
                    value = {message} // Vaso essa area seja preenchida de outra forma, sem ser digitando.
                />

                <button type="submit">
                    Enviar mensagem
                </button>
            </form>
            
        </div>
    )
}