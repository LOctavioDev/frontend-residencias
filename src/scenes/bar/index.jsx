import { Box } from '@mui/material';
import { Header, BarChart } from '../../components';

const Bar = () => {
  return (
    <Box m="20px">
      <Header
        title="Análisis de Tipos de Empleo"
        subtitle="Gráfica de Barras que muestra la distribución de estudiantes por tipo de empleo."
      />
      <Box height="75vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
    