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
        const response = await api.get('api/students/generation');
        console.log(response.data);
        const formattedData = formatDataForBarChart(response.data);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDataForBarChart = (studentsData) => {
    const total = studentsData.reduce((sum, item) => sum + item.count, 0); 

    return studentsData.map((item) => ({
      year: item._id?.year || 'Sin año',
      númeroDeEstudiantes: item.count,
      porcentaje: ((item.count / total) * 100).toFixed(2), 
    }));
  };

  return (
    <ResponsiveBar
      data={data}
      keys={['númeroDeEstudiantes']}
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
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Número de Estudiantes',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      colors={{ scheme: 'nivo' }}
      fillOpacity={0.85}
      borderColor={{ theme: 'background' }}
      label={(bar) => `${bar.data.porcentaje}%`} // Mostrar el porcentaje en cada barra
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
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

export default BarChart;
