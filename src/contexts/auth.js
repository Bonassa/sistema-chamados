
import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

export default function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadStorage(){
      const storageUser = localStorage.getItem('sistema_user');

      if(storageUser) setUser(JSON.parse(storageUser))
      setLoading(false);
    }

    loadStorage();
  }, [])

  async function signIn(email, password){
    setLoadingAuth(true);
    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then( async (value) => {
      let uid = value.user.uid;
      const userProfile = await firebase.firestore().collection('users').doc(uid).get();

      let data = {
        uid: uid,
        nome: userProfile.data().nome,
        email: value.user.email,
        avatarUrl: userProfile.data().avatarUrl
      }

      setUser(data);
      storageUser(data);
      toast.success(`Bem vindo de volta ${data.nome}`);
    })
    .catch((error) => {
      console.log(error);
      toast.error('Algo deu errado!')
    })
    .finally(() => {
      setLoadingAuth(false);
    })
  }

  async function signUp(email, password, name){
    setLoadingAuth(true);
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then( async (value) => {
      let uid = value.user.uid;

      await firebase.firestore().collection('users').doc(uid).set({
        nome: name,
        avatarUrl: null,
      })
      .then(() => {
        let data = {
          uid: uid,
          nome: name,
          email: value.user.email,
          avatarUrl: null
        }

        setUser(data);
        storageUser(data);
      })
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoadingAuth(false);
    })
  }

  async function signOut(){
    await firebase.auth().signOut();
    localStorage.removeItem('sistema_user');
    setUser(null);
  }

  function storageUser(data){
    localStorage.setItem('sistema_user', JSON.stringify(data));
  }

  return(
    /** !! transforma um objeto em booleano, caso tenha alguma coisa dentro retorna true, se for null retorna false */
    <AuthContext.Provider value={{ 
      signed: !!user, 
      user, 
      loading,
      loadingAuth,
      signUp,
      signOut,
      signIn,
      setUser,
      storageUser
    }} >
      { children }
    </AuthContext.Provider>
  );
}