import { useEffect, useState } from 'react';

import { api } from '../../services/api';


import styles from './styles.module.scss';

import logoImg from '../../assets/logo.svg';

import io from 'socket.io-client';



type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}
/*Vamos criar uma fila de mensagens */
const messagesQueue:Message[] = []

/*Mostrar as msg em tela sempre que o back-end receber uma. */
const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
    // Estou pegando a msg que o back-end acabou de receber, e colocando na fila messagesQueue
    messagesQueue.push(newMessage);
})

export function MessageList(){
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const timer = setInterval(() => {
            if(messagesQueue.length > 0) {
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean)) // filter(Boolean) remove valores que são falsos, como NULL, UNDEFINED etc.
            
                messagesQueue.shift()
            }
        }, 3000)
    }, [])


    useEffect(() => {
        api.get<Message[]>('/messages/last3').then(response => {
            setMessages(response.data);
        })
    }, [])
    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />    

            <ul className={styles.messageList}>
                {messages.map(message => {
                    return (
                    <li key={message.id}className={styles.message}>
                        <p className={styles.messageContent}>
                            {message.text}
                        </p>
                        <div className={styles.messageUser}>
                        
                        <div className={styles.userImage}>
                            <img src={message.user.avatar_url} alt={message.user.name} />
                        </div>
                        <span>{message.user.name}</span>
                    </div>
                    </li>
                    )
                })}
            </ul>
        </div>
    )
}