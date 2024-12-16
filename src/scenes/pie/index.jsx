import { Box } from '@mui/material';
import { Header, PieChart } from '../../components';

const Pie = () => {
  return (
    <Box m="20px">
      <Header
        title="Distribución de Egresados por Ciudad"
        subtitle="Este gráfico de pastel muestra la cantidad de egresados que se han graduado y que actualmente trabajan en diferentes ciudades. Permite visualizar la concentración de graduados en cada ubicación y entender mejor la dispersión geográfica de nuestros egresados."
        
      />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
