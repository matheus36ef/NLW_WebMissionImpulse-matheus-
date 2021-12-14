import { useContext} from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';

import styles from './styles.module.scss';

/* Vamos fazer:
    1 - Vamos Direcionar o usuario a tela de autenticação pelo github(oauth)
        1.1 - Com a autenticação feita no dithub, o mesmo irá redirecionar o usuario para a pagina que eu quiser, passando um codigo de autorização.
    2 - vamos pegar esse codigo, passar ao back-end para que ele possa trocar informações com a api do github.
    3 - o back-end vai verificar a auteticação desse usuario na NOSA API.
        3.1 - Vai salvar esses dados no BD.
*/


export function LoginBox(){
    /* Logica de login feita em src/contexts/auth.tsx */

    const {signInUrl} = useContext(AuthContext);
    
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