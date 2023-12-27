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

const ConsumptionGraph: React.FC<GraphValuesProps> = ({values}: GraphValuesProps) => {
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top' as const,
            },
            title: {
            display: true,
            text: 'Consumo',
            },
        },
    };
      
    const labels = ['Consumo de Energia Elétrica (KWh)', 'Energia Compensada (kWh)'];
      
    const data = {
        labels,
        datasets: [
            {
                label: 'Dados',
                data: values,
                backgroundColor: '#bd83b8',
            }
        ],
    };

    return(
        <Bar options={options} data={data} />
    );

}

export default ConsumptionGraph;