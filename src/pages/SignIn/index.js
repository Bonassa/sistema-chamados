
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import './styles.scss';
import logo from '../../assets/logo.png';

export default function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();
    if(email !== '' && password !== ''){
      signIn(email, password);
      setEmail('');
      setPassword('');
    }
  }

  return(
    <div className='container-center'>
      <div  className='login'>
        <div className='logo-area'>
          <img src={logo} alt="logo" />
        </div>

        <form onSubmit={handleSubmit} >
          <h1>Entrar</h1>
          <input type='text' placeholder='email@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type='password' placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} />
          {loadingAuth ? (
            <button type='button' disabled >Carregando...</button>  
          ) : (
            <button type='submit'>Acessar</button>
          )}
          
        </form>

        <Link to='/register' >Criar uma Conta</Link>
      </div>
    </div>
  );
}