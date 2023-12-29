import './styles.css';
import Container from '../../components/container';
import Header from '../../components/header';
import { FaSearch } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import VBox from '../../components/v-box';
import { useState, useEffect } from 'react';  
import { Data } from './interfaces';
import { ResponseBody } from './interfaces';

function LibraryPage() {

  const [apiData, setApiData] = useState<Data[]>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [noDataMessage, setNoDataMessage] = useState<string>('');
  const [notExistsData, setNotExistsData] = useState<boolean>(false);

  const uriBase = 'http://localhost:3333/invoice/all?client-number=';

  const fetchData = async () => {
    try {
      const response = await fetch(uriBase);
      const data: ResponseBody = await response.json();
      setApiData(data.data);
      console.log(data.data)
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

  const downloadInvoice = async (fileName: string) => {
    const response = await fetch(`http://localhost:3333/invoice/download?file-name=${fileName}`);
    const data: ResponseBody = await response.json();
    const byteCharacters = atob(data.data.toString());
    const byteNumbers = new Array(byteCharacters.length);
    for (let byteCharactersIndex = 0; byteCharactersIndex < byteCharacters.length; byteCharactersIndex++) {
      byteNumbers[byteCharactersIndex] = byteCharacters.charCodeAt(byteCharactersIndex);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  } 

  return (
    <body>
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
            className='dashboard-search-button'
            onClick={handleSearchClick}
          >
              <FaSearch/>
          </button>
        </div>
        <VBox height={20} />
        <main className='main-library'>

        {
          notExistsData &&
          <h3 className='not-exists-data-message'>{noDataMessage}</h3>
        }

        {
          apiData &&
          apiData.map((data: Data, index: number) => (
            <>
              <div className='invoice-item'>
                <div className='invoice-id'>
                  <label>ID</label>
                  <span>{data.id}</span>
                </div>
                <div className='invoice-month-reference'>
                  <label>Mês de referência</label>
                  <span>{data.referenceMonth}</span>
                </div>
                <div className='invoice-file-name'>
                  <label>Nome do arquivo</label>
                  <span>{data.pathFile}</span>
                </div>
                <div className='invoice-client-number'>
                  <label>Número do cliente</label>
                  <span>{data.clientNumber}</span>
                </div>
                <div className='invoice-download'>
                  <label>Download</label>
                  <button onClick={() => downloadInvoice(data.pathFile)}><FaDownload/></button>
                </div>
              </div>
              <VBox height={20} />
            </>
          ))
        }
        </main>
      </Container>
    </body>
  );
}

export default LibraryPage;