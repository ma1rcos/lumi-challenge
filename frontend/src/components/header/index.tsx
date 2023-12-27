import HBox from '../h-box';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {

  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/');
  };

  const goToLibrary = () => {
    navigate('/library');
  };

  return (
    <div className='header'>
      <button onClick={goToDashboard} id='dashboard-button' className='page-button'>
        Dashboard
      </button>
      <HBox width={20} />
      <button onClick={goToLibrary} id='library-button' className='page-button'>
        Biblioteca de Faturas
      </button>
    </div>
  );
}

export default Header;