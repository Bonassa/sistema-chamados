
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header";
import Title from '../../components/Title';
import Modal from "../../components/Modal";

import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns';

import './styles.scss';
import { HiOutlineChatAlt2, HiOutlinePlusCircle, HiOutlinePencilAlt, HiOutlineSearch } from 'react-icons/hi';

export default function Dashboard(){
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState();
  const [isEmpty, setIsEmpty] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState();
  
  const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

  useEffect(() => {
    async function loadChamados(){
      await listRef.limit(5).get()
      .then((snapshot) => {
        updateState(snapshot);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoadingMore(false);
        setLoading(false);
      })
    }

    loadChamados();

    return () => {

    }
  }, [])


  async function updateState(snapshot){
    const isCollectionEmpty = snapshot.size === 0;

    if(!isCollectionEmpty){
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento
        })
      })

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setChamados(chamados => [...chamados, ...lista]);
    } else {
      setIsEmpty(true);
    }
  }

  async function handleMore(){
    setLoadingMore(true);
    await listRef.startAfter(lastDoc).limit(5).get()
    .then((snapshot) => {
      updateState(snapshot)
      setLoadingMore(false);
    })
  }

  function toggleModal(chamado){
    setShowModal(!showModal); //toggle
    setDetailModal(chamado);
  }

  if(loading){
    return(
      <div>
        <Header />

        <div className="content">
          <Title name='Atendimentos'>
            <HiOutlineChatAlt2 size={25} />
          </Title>
        </div>
      </div>
    );
  }

  return(
    <div>
      <Header />

      <div className="content">
        <Title name='Atendimentos'>
          <HiOutlineChatAlt2 size={25} />
        </Title>

        <div className="container">
          {chamados.length === 0 ? (
            <div className="no-itens">
              <span>Nenhum chamado registrado...</span>

              <div className="add-button">
                <Link to="/newchamado">
                  <HiOutlinePlusCircle size={25} color="#FFF" />
                  Novo chamado
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="add-button">
                <Link to='/newchamado'>
                  <HiOutlinePlusCircle size={25} color="#FFF" />
                  Novo chamado
                </Link>
              </div>

              <div className="table-chamados">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Cliente</th>
                      <th scope="col">Assunto</th>
                      <th scope="col">Status</th>
                      <th scope="col">Cadastrado em</th>
                      <th scope="col">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chamados.map((chamado, index) => (
                      <tr key={index}>
                        <td data-label='Cliente'>{chamado.cliente}</td>
                        <td data-label='Assunto'>{chamado.assunto}</td>
                        <td data-label='Status'>
                          <span className="badge" style={{backgroundColor: chamado.status === 'Aberto' ? '#5CB85C' : '#777'}} >{chamado.status}</span>
                        </td>
                        <td data-label='Cadastrado em'>{chamado.createdFormated}</td>
                        <td className="td-acoes">
                          <div className="btn-action">
                            <button style={{backgroundColor: '#3583F6'}} onClick={() => toggleModal(chamado)}>
                              <HiOutlineSearch color="#FFF" size={17} />
                            </button>
                          </div>
                          
                          <div className="btn-action">
                            <Link className="action" style={{backgroundColor: '#F6A935'}} to={`/editchamado/${chamado.id}`} >
                              <HiOutlinePencilAlt color="#FFF" size={17} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {loadingMore && <h3>Buscando dados...</h3>}
              { !loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore} >Buscar mais</button>}
            </>
          )}

        </div>
      </div>

      {showModal && (
        <Modal conteudo={detailModal} close={toggleModal} />
      )}
    </div>
  );
}