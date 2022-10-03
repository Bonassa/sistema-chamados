
import './styles.scss';
import { HiOutlineX } from 'react-icons/hi';

export default function Modal({conteudo, close}){
  return (
    <div className='modal'>
      <div className='modal-container'>
        <button className='modal-close' onClick={ close } >
          <HiOutlineX size={24} color="#FFF" />
          Voltar
        </button>

        <div className='modal-body'>
          <h2>Detalhes do chamado</h2>

          <div className='modal-row'>
            <label>Cliente: <span>{conteudo.cliente}</span></label>
          </div>
          <div className='modal-row'>
            <label>Assunto: <span>{conteudo.assunto}</span></label>
            <label>Cadastrado em: <span>{conteudo.createdFormated}</span></label>
          </div>
          <div className='modal-row'>
            <label>Status: <span style={{ color: '#FFF', backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#777'}} >{conteudo.status}</span></label>
          </div>

          {conteudo.complemento !== '' &&(
            <div>
              <label>Complemento</label>
              <p>{conteudo.complemento}</p>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}