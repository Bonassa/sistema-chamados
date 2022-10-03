
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { useHistory, useParams } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';

import './styles.scss';
import Title from '../../components/Title';
import Header from '../../components/Header';
import { HiOutlinePlus } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function NewChamados(){
  const { id } = useParams();
  const history = useHistory();

  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [loading, setLoading] = useState(true);

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  const [idCustomer, setIdCustomer] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadCustomers(){
      await firebase.firestore().collection('customers').get()
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        if(lista.length === 0){
          console.log('Nenhuma empresa encontrada');
          setCustomers([{ id: 1, nomeFantasia: '' }]);
        } else {
          setCustomers(lista);

          if(id){
            loadId(lista);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setCustomers([{ id: 1, nomeFantasia: '' }]);
      })
      .finally(() => {
        setLoading(false);
      })
    }

    loadCustomers();
  }, [])

  async function loadId(lista){
    await firebase.firestore().collection('chamados').doc(id).get()
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento);

      let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
      setCustomerSelected(index);
      setIdCustomer(true);
    })
    .catch((error) => {
      console.log(error);
    })
  }


  async function handleSubmit(e){
    e.preventDefault();

    if(idCustomer){
      await firebase.firestore().collection('chamados').doc(id)
      .update({
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(() => {
        toast.success('Chamado Editado com sucesso!');
        setCustomerSelected(0);
        setComplemento('');
        history.push('/dashboard');
      })
      .catch((error) => {
        toast.error('Aconteceu algum erro!');
        console.log(error);
      })
      
      return;
    }

    await firebase.firestore().collection('chamados').add({
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(() => {
      toast.success("Cadastrado com sucesso");
      setComplemento('');
      setCustomerSelected(0);
    })
    .catch((error) => {
      console.log(error);
      toast.error("Erro ao cadastrar");
    })
  }

  return(
    <div>
      <Header />

      <div className='content'>
        <Title name='Novo Chamado'>
          <HiOutlinePlus size={25} />
        </Title>

        <div className='container'>
          <form className='form-profile form-chamados-add' onSubmit={handleSubmit}>
            <label>Cliente</label>

            {loading ? (
              <input type='text' readOnly value='Carregando...' />
            ) : (
              <select value={customerSelected} onChange={(e) => setCustomerSelected(e.target.value)}>
                {customers.map((item, index) => (
                  <option key={index} value={index} >{item.nomeFantasia}</option>
                ))}
              </select>
            )}


            <label>Assunto</label>
            <select value={assunto} onChange={(e) => setAssunto(e.target.value)}>
              <option value='Suporte'>Suporte</option>
              <option value='Visita Tecnica'>Visita Tecnica</option>
              <option value='Financeiro'>Financeiro</option>
            </select>

            <label>Status</label>
            <div className='status'>
              <div className='status-option'>
                <input type='radio' name='radio' id='radio1' value='Aberto' 
                  onChange={(e) => setStatus(e.target.value)} checked={ status === 'Aberto' } />
                <label for='radio1' className='radio-option' >Em Aberto</label>
              </div>
              <div className='status-option'>
                <input type='radio' name='radio' id='radio2' value='Progresso' 
                  onChange={(e) => setStatus(e.target.value)} checked={ status === 'Progresso' } />
                <label for='radio2' className='radio-option' >Em Progresso</label>
              </div>
              <div className='status-option'>
                <input type='radio' name='radio' id='radio3' value='Atendido' 
                  onChange={(e) => setStatus(e.target.value)} checked={ status === 'Atendido' } />
                <label for='radio3' className='radio-option' >Atendido</label>
              </div>
            </div>

            <label>Complemento</label>
            <textarea type='text' placeholder='Descreva o seu problema (opicional)' 
              value={complemento} onChange={(e) => setComplemento(e.target.value) } />

            <button type='submit'>Cadastrar</button>
          </form>
        </div>

      </div>
    </div>
  );
}