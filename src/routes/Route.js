/** - Criando o nosso component de Route de modo personalizado para fazer verificação de acessos ao usuário */

import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}){

  const { signed, loading } = useContext(AuthContext)

  // Verificando se está em modo de loading
  if(loading){
    return(
      <div>

      </div>
    );
  }

  // Acessando rota privada sem login
  if(!signed && isPrivate){
    return <Redirect to="/" />
  }

  // Acessando login estando logado
  if(signed && !isPrivate){
    return <Redirect to="/dashboard" />
  }

  return (
    <Route 
      {...rest}
      render={props => (
        <Component {...props} />
      )}
    />
  );
}