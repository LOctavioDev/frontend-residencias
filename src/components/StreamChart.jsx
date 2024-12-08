import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from '@mui/material';
import api from '../services/apiService';
import { useEffect, useState } from 'react';
import { tokens } from '../theme';

const BarChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/students/generation');
        const formattedData = formatDataForBarChart(response.data);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDataForBarChart = (studentsData) => {
    // Formateamos los datos para un gráfico de barras agrupadas
    return studentsData.map(item => ({
      year: item._id.year,
      númeroDeEstudiantes: item.count, // Cambiamos 'count' por 'númeroDeEstudiantes'
    }));
  };

  return (
    <ResponsiveBar
      data={data}
      keys={['númeroDeEstudiantes']} // Actualizamos la clave
      indexBy="year"
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.gray[100],
            },
          },
          legend: {
            text: {
              fill: colors.gray[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.gray[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.gray[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.gray[100],
          },
        },
      }}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Años',
        legendOffset: 36,
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Número de Estudiantes', // Leyenda del eje Y
        legendOffset: -40,
      }}
      colors={{ scheme: 'nivo' }}
      fillOpacity={0.85}
      borderColor={{ theme: 'background' }}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          translateX: 100,
          itemWidth: 80,
          itemHeight: 20,
          itemTextColor: '#999999',
          symbolSize: 12,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000000',
              },
            },
          ],
        },
      ]}
    />
  );
};

export default BarChart;
