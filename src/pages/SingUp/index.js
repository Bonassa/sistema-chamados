
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

import logo from '../../assets/logo.png';

export default function SignIn(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();
    if(name !== '' && email !== '' && password !== ''){
      signUp(email, password, name);
    }
  }

  return(
    <div className='container-center'>
      <div  className='login'>
        <div className='logo-area'>
          <img src={logo} alt="logo" />
        </div>

        <form onSubmit={handleSubmit} >
          <h1>Crie sua Conta</h1>
          <input type='text' placeholder='Nome' value={name} onChange={(e) => setName(e.target.value)} />
          <input type='text' placeholder='email@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type='password' placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} />
          {loadingAuth ? (
            <button type='button' disabled >Carregando...</button>  
          ) : (
            <button type='submit'>Cadastrar</button>
          )}
        </form>

        <Link to='/' >Já possuo uma conta</Link>
      </div>
    </div>
  );
}