import './styles.css';
import { ContainerProps } from './interface';

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className='container'>
        {children}
    </div>
  );
}

export default Container;