import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

// Tipagens 
// Dados que vamos ter dentro desse contexto

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = { // Aqui falamos que tipo de dados o contexto retorna.
    user: User | null;
    signInUrl: string;
    signOut: () => void; // estamos declarando que signOut é uma função, com (vazio) pois não estamos passando nenhum argumento. e falamos que é um void pois não retorna nada.

}

type AuthProvider = {
    children: ReactNode;
}

type authResponse = {
    token: string;
    user : {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

// Quando estamos crinado um contexto no React, quando formos criar um formato de dados desse contexto, é legal fazermos asism:
//                  createContext(um objeto vazio, e a tipagem desse contexto)
// const variavel = createContext({} as AuthContextData);
// Fazendo asism, quando eu for passar pro value no AuthContext.Provider [a baixo] eu vou saber oque ele esta passando.
// No mesmo vamos receber desta forma: <AuthContext.Provider value={ {} }> a primeira chave quer dizer que é um informação JS, a segunda quer dizer que essa informação é um objeto.
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null);
    
    /*  url de login, passando os tipos de dados que eu quero do usuario, no github, e tambem uma uri 
        de redirecionamento do usuario apos o login bem sucedido. (no caso ja está configurado no github da aplicação)  */
        const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=113f56b20d3d768a7ace`

        /* Agora vamos fazer:
            1 - Pegar esse codigo da url.
                1.1 - enviar isso para o back-end
            2 - O back-end irá pegar esse codigo.
                2.1 - Vai solicitar as informações do usuário com essa chave de acesso.
            3 - E assim verificar se o usuario está autenticado na nossa aplicação.
        */ 
        // Eviar os dados para o back-end.
        // Receber os dados do back-end.
        async function signIn(githubCode: string){
            const response = await api.post<authResponse>('authenticate', {
                code: githubCode,
            });
    
            // Tratando os dados recebidos do back-end
            const {token, user} = response.data;

            
            localStorage.setItem('@dowhile:token', token);
            setUser(user);
            
            
            // Aqui estamos passando o token no cabeçalho da requisição.
            api.defaults.headers.common.authorization = `Bearer ${token}`;
        }

        useEffect(( ) => { // Pegando o token que está no localStorage e utilizando ele para login.
            const token = localStorage.getItem('@dowhile:token');

            if(token) {
                // Aqui estamos passando o token no cabeçalho da requisição.
                api.defaults.headers.common.authorization = `Bearer ${token}`;

                api.get<User>('profile').then(response => {
                    setUser(response.data);
                })
            }
        }, []);

        function signOut() {
            setUser(null);localStorage.removeItem('@dowhile:token');
        }


        useEffect(() => { // Executado primeiro
            const url = window.location.href; // Estamos buscando a url da aplicação.
            const hasGithubCode = url.includes('?code=');
    
    
            if(hasGithubCode){
                const [urlWithoutCode, githubCode] = url.split('?code=');
    
                window.history.pushState({}, '', urlWithoutCode) //Aqui estamos limpando a url, para não ficar aparecendo o codigo de autenticação.
                //pushState({objeto}, 'url', url) -> estamos forçando a navegação do usuario
    
                signIn(githubCode); // Enviar o codigo para o back-end
            }
        }, []) // o Arrei vazio fala que queremos executar uma unica vez assim que passar por aqui.
    return (
            <AuthContext.Provider value={ {signInUrl, user, signOut} }>
            {/* O provider, é um componente que faz com que, todos os componentes que estiverem dentro desse AuthProvider, 
                tenho acesso as informações de contexto. 
                ex: Se dentro desse contexto eu colocar uma informação, que o usuario está logado ou não. Todos os componentes que estiverem 
                nesse escopo irá ter essa informação.
                
                No caso vamos colocar todos os componentes de nossa aplicação. Pois todos irão precisar dessa informação.
            */}

            {props.children}

            
        </AuthContext.Provider>
    )
}