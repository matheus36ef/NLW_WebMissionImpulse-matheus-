import { createContext, ReactNode } from 'react';

const AuthContext = createContext(null);

type AuthProvider = {
    children: ReactNode;
}


console.log("I LOVE JESUS");
export function AuthProvider(props: AuthProvider) {
    return (
        <AuthContext.Provider value={null}>
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