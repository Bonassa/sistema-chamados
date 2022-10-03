
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineCog } from "react-icons/hi";

import './styles.scss';
import avatar from '../../assets/avatar.png';

export default function Header(){
  const { user } = useContext(AuthContext);

  return(
    <div className='side-bar' >
      <div id='image'>
        <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Foto avatar" />
      </div>
      <div id='options'>
        <Link to="/dashboard"><HiOutlineHome color='#FFF' size={24} />Chamados</Link>
        <Link to="/customers"><HiOutlineUserGroup color='#FFF' size={24} />Clientes</Link>
        <Link to="/profile"><HiOutlineCog color='#FFF' size={24} />Configurações</Link>
      </div>
    </div>
  );
}