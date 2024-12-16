import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,

} from '@mui/material';
import { Header } from '../../components';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../services/apiService';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const nav = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      cellClassName: 'name-column--cell',
      valueGetter: (params) => `${params.row.name.first} ${params.row.name.last}`,
    },
    {
      field: 'control_number',
      headerName: 'Número de Control',
      flex: 1,
    },
    {
      field: 'company',
      headerName: 'Empresa',
      flex: 1,
      valueGetter: (params) => params.row.company.name,
    },
    {
      field: 'position',
      headerName: 'Posición',
      flex: 1,
      valueGetter: (params) => params.row.company.position,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <Box
          display="flex"
          gap="10px"
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => goToStudent(params.row.control_number)}
          >
            Ver Detalles
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => confirmDelete(params.row)}
          >
            Eliminar
          </Button>
        </Box>
      ),
    },
  ];

  const goToStudent = (id) => {
    nav(`/useredit/${id}`);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    try {
      await api.delete(`/api/${selectedStudent.control_number}`);
      setStudents((prev) =>
        prev.filter(
          (student) => student.control_number !== selectedStudent.control_number
        )
      );
    } catch (error) {
      console.error('Error al eliminar el estudiante:', error);
    } finally {
      setLoading(false);
      setOpenDialog(false);
      setSelectedStudent(null); 
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false); 
    setSelectedStudent(null); 
  };

  const confirmDelete = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true); 
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('api');
        const studentsData = response.data.map((student) => ({
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
      <Header
        title="Egresados"
        subtitle="Datos de los egresados"
      />
      <Box
        mt="40px"
        height="75vh"
        flex={1}
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            border: 'none',
          },
          '& .name-column--cell': {
            color: colors.primary[100],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.orange[500],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.orange[500],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.orange[400]} !important`,
          },
          '& .MuiDataGrid-iconSeparator': {
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
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar a {selectedStudent?.name?.first}{' '}
            {selectedStudent?.name?.last}? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;
