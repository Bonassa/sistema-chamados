
import './styles.scss';

export default function Title({ name, children }){
  return(
    <div className='title'>
      {children}
      <span>{name}</span>
    </div>
  );
}