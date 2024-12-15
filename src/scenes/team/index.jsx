import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import api from "../../services/apiService";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const nav = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    // { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
      valueGetter: (params) => `${params.row.name.first} ${params.row.name.last}`, 
    },
    {
      field: "control_number",
      headerName: "Número de Control",
      flex: 1,
    },
    {
      field: "company",
      headerName: "Empresa",
      flex: 1,
      valueGetter: (params) => params.row.company.name, 
    },
    {
      field: "position",
      headerName: "Posición",
      flex: 1,
      valueGetter: (params) => params.row.company.position, 
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => goToStudent(params.row.control_number)} 
        >
          Ver Detalles
        </Button>
      ),
    },
  ];

  const goToStudent = (id) => {
    nav(`/useredit/${id}`);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('api'); 
        const studentsData = response.data.map(student => ({
          id: student._id, 
          ...student,
        }));
        setStudents(studentsData); 
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchStudents(); 
  }, []);

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <Box m="20px">
      <Header title="Egresados" subtitle="Datos de los egresados" />
      <Box
        mt="40px"
        height="75vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.primary[100],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.orange[500],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.orange[500],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.orange[400]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <DataGrid
          rows={students} 
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          // checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Team;
