import { useEffect } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { api } from '../../services/api';

import styles from './styles.module.scss';
/* Vamos fazer:
    1 - Vamos Direcionar o usuario a tela de autenticação pelo github(oauth)
        1.1 - Com a autenticação feita no dithub, o mesmo irá redirecionar o usuario para a pagina que eu quiser, passando um codigo de autorização.
    2 - vamos pegar esse codigo, passar ao back-end para que ele possa trocar informações com a api do github.
    3 - o back-end vai verificar a auteticação desse usuario na NOSA API.
        3.1 - Vai salvar esses dados no BD.
*/

// tipagens
type authResponse = {
    token: string;
    user : {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}


export function LoginBox(){
    /*  url de login, passando os tipos de dados que eu quero do usuario, no github, e tambem uma uri 
    de redirecionamento do usuario apos o login bem sucedido. (no caso ja está configurado no github da aplicação)  */
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=113f56b20d3d768a7ace`;

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
    }

    useEffect(() => {
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
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>

            {/* pegando o codigo de autorização para o login no github */}
            <a href={signInUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size="24"/>
                Entrar com Github
            </a>

        </div>
    )
}