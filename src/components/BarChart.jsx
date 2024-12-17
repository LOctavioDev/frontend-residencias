/* eslint-disable react/prop-types */
import { ResponsiveBar } from '@nivo/bar';
import { useEffect, useState } from 'react';
import { tokens } from '../theme';
import { useTheme } from '@mui/material';
import api from '../services/apiService';

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get('api/students/activity');
      const totalStudents =
        response.data.working.count +
        response.data.notWorking.count +
        response.data.studying.count +
        response.data.notStudying.count;

      const transformedData = [
        {
          type: 'Trabaja',
          Cantidad: response.data.working.count || 0,
          percentage: totalStudents
            ? ((response.data.working.count / totalStudents) * 100).toFixed(2)
            : '0',
        },
        {
          type: 'No trabaja',
          Cantidad: response.data.notWorking.count || 0,
          percentage: totalStudents
            ? ((response.data.notWorking.count / totalStudents) * 100).toFixed(2)
            : '0',
        },
        {
          type: 'Estudia',
          Cantidad: response.data.studying.count || 0,
          percentage: totalStudents
            ? ((response.data.studying.count / totalStudents) * 100).toFixed(2)
            : '0',
        },
        {
          type: 'No estudia ni trabaja',
          Cantidad: response.data.notStudying.count || 0,
          percentage: totalStudents
            ? ((response.data.notStudying.count / totalStudents) * 100).toFixed(2)
            : '0',
        },
      ];
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ResponsiveBar
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
      keys={['Cantidad']}
      indexBy="type"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#38bcb2',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#eed312',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: 'color',
        modifiers: [['darker', '1.6']],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'Tipo de Actividad',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'Cantidad',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return (
          e.id +
          ': ' +
          e.formattedValue +
          ' en tipo: ' +
          e.indexValue +
          ', porcentaje: ' +
          e.data.percentage +
          '%'
        );
      }}
      tooltip={({ id, value, data }) => (
        <div>
          <strong>{id}</strong>: {value} ( {data.percentage}% )
        </div>
      )}
    />
  );
};

export default BarChart;
