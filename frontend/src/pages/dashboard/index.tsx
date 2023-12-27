import './styles.css';
import Container from '../../components/container';
import Header from '../../components/header';
import VBox from '../../components/v-box';
import { FaSearch } from "react-icons/fa";
import ConsumptionGraph from './graphs/consumption';
import EconomyGraph from './graphs/economy';
import { useState, useEffect } from 'react';

interface Data {
  compensatedEnergy: number;
  economyGD: number;
  eletricalEnergy: number;
  totalValueWithoutGD: number;
}

interface ResponseBody {
  statusCode: number;
  message: string;
  data: Data;
}

function DashboardPage() {

  const [apiData, setApiData] = useState<Data>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [noDataMessage, setNoDataMessage] = useState<string>('');
  const [notExistsData, setNotExistsData] = useState<boolean>(false);

  const uriBase = 'http://localhost:3333/invoice/consumption?client-number=';

  const fetchData = async () => {
    try {
      const response = await fetch(uriBase);
      const data: ResponseBody = await response.json();
      setApiData(data.data);
      if (data.statusCode == 404) {
        setNoDataMessage('Nenhum dado encontrado');
        setNotExistsData(true);
      } else {
        setNotExistsData(false);
      }
    } catch {
      setNoDataMessage('Os dados não puderam ser econtrados');
      setNotExistsData(true);
    }
  };

  const fetchFilteredData = async (clientNumber: string) => {
    try {
      const response = await fetch(`${uriBase}${clientNumber}`);
      const data: ResponseBody = await response.json();
      setApiData(data.data);
      if (data.statusCode == 404) {
        setNoDataMessage('Nenhum dado encontrado');
        setNotExistsData(true);
      } else {
        setNotExistsData(false);
      }
    } catch {
      setNoDataMessage('Os dados não puderam ser econtrados');
      setNotExistsData(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchClick = () => {
    fetchFilteredData(searchValue);
  };
  
  return (
    <div>
      <Container>
        <Header/>
        <VBox height={20} />
        <div className='dashboard-search-area'>
          <input 
            placeholder='Busque pelo número do cliente' 
            className='dashboard-search-input' 
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)} 
          />
          <button 
            onClick={handleSearchClick}
            className='dashboard-search-button'>
              <FaSearch/>
          </button>
        </div>
        <VBox height={20} />
        <main className='main-dashboard'>

          {
            notExistsData &&
            <h3 className='not-exists-data-message'>{noDataMessage}</h3>
          }
        
          {
            apiData &&
              <>
                <div className='energy-graph'>
                  <ConsumptionGraph values={[apiData.eletricalEnergy, apiData.compensatedEnergy]} />
                </div><div className='money-graph'>
                  <EconomyGraph values={[apiData.totalValueWithoutGD, apiData.economyGD]} />
                </div>
              </>
          }

        </main>
      </Container>
    </div>
  );
}

export default DashboardPage;