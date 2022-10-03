
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';

import './styles.scss';
import { toast } from 'react-toastify';
import { HiOutlineCog, HiOutlineUpload } from 'react-icons/hi';
import avatar from '../../assets/avatar.png';

import Header from '../../components/Header';
import Title from '../../components/Title';

export default function Profile(){
  const { user, signOut, setUser, storageUser } = useContext(AuthContext);
  const [foto, setFoto] = useState(user && user.avatarUrl);
  const [fotoUpdate, setFotoUpdate] = useState(null);
  const [nome, setNome] = useState(user && user.nome);
  const email = user.email;

  async function handleSave(e){
    e.preventDefault();

    // Atualizando apenas o nome
    if(fotoUpdate === null && nome !== ''){
      await firebase.firestore().collection('users').doc(user.uid)
      .update({
        nome: nome
      })
      .then(() => {
        let data = {
          ...user,
          nome: nome
        }
        setUser(data);
        storageUser(data);
        toast.success("Nome de usuário atualizado!")
      })
    } else if(fotoUpdate !== null && nome !== ''){
      if(user.avatarUrl !== null){
        deleteExistentFoto();
      }
      handleUpload();
    }
  }

  async function deleteExistentFoto(){
    const lista = firebase.storage().ref(`images/${user.uid}`);

    lista.listAll().then((res) => {
      res.items.forEach((itemRef) => {
        firebase.storage().ref(`images/${user.uid}`).child(itemRef.name).delete()
      })
    })
  }

  async function handleUpload(){
    const currentUid = user.uid;
    
    const uploadTask = await firebase.storage().ref(`images/${currentUid}/${fotoUpdate.name}`)
    .put(fotoUpdate)
    .then( async () => {
      await firebase.storage().ref(`images/${currentUid}`).child(fotoUpdate.name).getDownloadURL()
      .then( async (url) => {
        await firebase.firestore().collection('users').doc(currentUid)
        .update({
          avatarUrl: url,
          nome: nome
        })
        .then(() => {
          let data = {
            ...user,
            avatarUrl: url,
            nome: nome
          }

          setUser(data);
          storageUser(data);
          setFotoUpdate(null);

          toast.success("Informações Atualizadas!")
        })
      })
    } )
  }

  function handlePreview(e){
    const image = e.target.files[0];

    // Imagem menor que 2 Mb
    if(image.size < 2000000){
      if(image.type === 'image/jpeg' || image.type === 'image/png' || image.type === 'image/jpg'){
        setFotoUpdate(image);
        setFoto(URL.createObjectURL(image));
      } else {
        toast.error('Envie uma imagem do tipo .png ou .jpeg');
        setFotoUpdate(null);
        return null;
      }
    } else {
      toast.error('A imagem ultrapassa o limite de 2Mb')
    }
  }

  return(
    <div>
      <Header />

      <div className='content' onSubmit={handleSave}>
        <Title name="Meu Perfil" >
          <HiOutlineCog size={25} />
        </Title>

        <div className='container'>
          <form className='form-profile'>
            <label className='label-avatar'>
              <span>
                <HiOutlineUpload color='#FFF' size={28} />
              </span>

              <input type="file" accept='image/*' onChange={handlePreview} /><br />
              {foto === null ?
                <img src={avatar} width={250} height={250} alt="Foto de Perfil" />
                :
                <img src={foto} width={250} height={250} alt="Foto de Perfil" />
              }
            </label>

            <label>Nome</label>
            <input type='text' value={nome} onChange={(e) => setNome(e.target.value)} />

            <label>Email</label>
            <input type='email' value={email} disabled />

            <button type='submit' >Salvar</button>
          </form>
        </div>

        <div className='container' >
          <button className='btn-logout' onClick={signOut}>Sair</button>
        </div>
      </div>
    </div>
  );
}