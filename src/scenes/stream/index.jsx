import { Box } from "@mui/material";
import { Header, StreamChart } from "../../components";

const Stream = () => {
  return (
    <Box m="20px">
      <Header title="Distribución de Egresados por Generación" subtitle="Este gráfico muestra la cantidad de egresados que se han graduado en cada año académico. Permite visualizar las tendencias a lo largo del tiempo y entender la evolución del número de graduados en nuestras generaciones." />
      <Box height="75vh">
        <StreamChart />
      </Box>
    </Box>
  );
};

export default Stream;