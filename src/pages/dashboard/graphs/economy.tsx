import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import { GraphValuesProps } from './interface';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const EconomyGraph: React.FC<GraphValuesProps> = ({values}: GraphValuesProps) => {

    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top' as const,
            },
            title: {
            display: true,
            text: 'Economia',
            },
        },
    };
      
    const labels = ['Valor Total sem GD (R$)', 'Economia GD (R$)'];
      
    const data = {
        labels,
        datasets: [
            {
                label: 'Dados',
                data: values,
                backgroundColor: '#f1916d',
            }
        ],
    };
    
    return(
        <Bar options={options} data={data} />
    );

}

export default EconomyGraph;