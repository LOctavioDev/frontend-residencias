import { ResponsiveStream } from '@nivo/stream';
import { useTheme } from '@mui/material';
import api from '../services/apiService';
import { useEffect, useState } from 'react';
import { tokens } from '../theme';

const StreamChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/students/generation');
        const formattedData = formatDataForStream(response.data);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDataForStream = (studentsData) => {
    // Convertir los datos en el formato adecuado para el gráfico de flujo
    const years = studentsData.map((item) => item._id.year);
    const counts = studentsData.map((item) => item.count);

    // Para el gráfico de flujo, necesitamos un formato específico
    return years.map((year, index) => ({
      year: year,
      count: counts[index],
    }));
  };

  return (
    <ResponsiveStream
      data={data}
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
      keys={['count']} // Aquí se debe ajustar según las claves que quieras mostrar
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Años',
        legendOffset: 36,
        truncateTickAt: 0,
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Número de Estudiantes',
        legendOffset: -40,
        truncateTickAt: 0,
      }}
      enableGridX={false}
      enableGridY={false}
      curve="natural"
      offsetType="diverging"
      colors={{ scheme: 'nivo' }}
      fillOpacity={0.85}
      borderColor={{ theme: 'background' }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#2c998f',
          size: 4,
          padding: 2,
          stagger: true,
        },
        {
          id: 'squares',
          type: 'patternSquares',
          background: 'inherit',
          color: '#e4c912',
          size: 6,
          padding: 2,
          stagger: true,
        },
      ]}
      dotSize={8}
      dotColor={{ from: 'color' }}
      dotBorderWidth={2}
      dotBorderColor={{
        from: 'color',
        modifiers: [['darker', 0.7]],
      }}
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

export default StreamChart;
