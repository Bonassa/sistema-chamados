
import { useState } from 'react';
import firebase from '../../services/firebaseConnection';

import './styles.scss';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { HiOutlineUserGroup } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function Customers(){
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');

  async function handleAdd(e){
    e.preventDefault();

    if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
      await firebase.firestore().collection('customers')
      .add({
        nomeFantasia: nomeFantasia,
        cnpj: cnpj,
        endereco: endereco
      })
      .then(() => {
        setNomeFantasia('');
        setCnpj('');
        setEndereco('');
        toast.success('Empresa cadastrada com sucesso');
      })
      .catch((error) => {
        console.log(error);
        toast.error('Não foi possível cadastrar');
      })
    } else {
      toast.info('Campos em branco')
    }
  }
  
  return(
    <div>
      <Header />

      <div className='content'>
        <Title name='Cadastro de Clientes'>
          <HiOutlineUserGroup size={25} />
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleAdd} >
            <label>Nome Fantasia</label>
            <input type='text' placeholder='Nome da empresa' value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />

            <label>CNPJ</label>
            <input type='text' placeholder='CNPJ da empresa' value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
            
            <label>Endereco</label>
            <input type='text' placeholder='Nome da empresa' value={endereco} onChange={(e) => setEndereco(e.target.value)} />

            <button type='submit' >Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}