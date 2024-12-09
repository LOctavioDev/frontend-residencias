import { Box } from '@mui/material';
import { Header, BarChart } from '../../components';

const Bar = () => {
  return (
    <Box m="20px">
      <Header
        title="Análisis de Actividades de los Egresados"
        subtitle="Gráfica de Barras que muestra la distribución de egresados según si trabajan, estudian o ambas."
      />
      <Box height="75vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
