import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { convertDateToUnix, convertUnixToDate } from '../../services/utils';

export const Historial = () => {
  const { control_number } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: '', startDateH: '', endDateH: '' });
  const nav = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/api/${control_number}`);
        setUserData(response.data);
      } catch (err) {
        setError('Error al cargar los datos del historial.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [control_number]);

  const handleModalOpen = (history = null) => {
    setSelectedHistory(history);
    setFormData({
      name: history?.name || '',
      startDateH: history?.startDateH ? convertUnixToDate(history.startDateH) : '',
      endDateH: history?.endDateH ? convertUnixToDate(history.endDateH) : '',
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ name: '', startDateH: '', endDateH: '' });
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    const companyIndex = userData.companyHistory.findIndex(
      (history) => history.name === companyToDelete.name
    );

    if (companyIndex === -1) {
      console.error('Empresa no encontrada en el historial');
      setLoading(false);
      return;
    }

    const payload = { companyIndex };

    try {
      const response = await api.delete(`/api/${control_number}/company-history/delete`, {
        data: payload,
      });

      setUserData((prev) => ({
        ...prev,
        companyHistory: response.data.companyHistory,
      }));

      handleModalClose();
      setOpenDialog(false);
    } catch (err) {
      console.error('Error al eliminar la empresa del historial:', err);
      setError('Error al eliminar la empresa del historial.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  const handleDelete = (row) => {
    setCompanyToDelete(row);
    setOpenDialog(true); 
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = selectedHistory
      ? {
          companyIndex: userData.companyHistory.findIndex(
            (history) => history.name === selectedHistory.name
          ),
          updatedCompany: {
            name: formData.name,
            startDateH: convertDateToUnix(formData.startDateH),
            endDateH: formData.endDateH ? convertDateToUnix(formData.endDateH) : null,
          },
        }
      : {
          name: formData.name,
          startDateH: convertDateToUnix(formData.startDateH),
          endDateH: formData.endDateH ? convertDateToUnix(formData.endDateH) : null,
        };

    try {
      let response;

      if (selectedHistory) {
        console.log(payload);
        response = await api.put(`/api/${control_number}/company-history/edit`, payload);

        setUserData((prev) => ({
          ...prev,
          companyHistory: response.data.companyHistory,
        }));
      } else {
        response = await api.put(`/api/${control_number}/company-history`, payload);

        setUserData((prev) => ({
          ...prev,
          companyHistory: [...prev.companyHistory, response.data.companyHistory.pop()],
        }));
      }

      handleModalClose();
    } catch (err) {
      console.error('Error al guardar los datos del historial:', err);
      setError('Error al guardar los datos del historial.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Empresa',
      flex: 1,
    },
    {
      field: 'startDateH',
      headerName: 'Fecha de inicio',
      flex: 1,
      valueGetter: (params) =>
        params.value ? convertUnixToDate(params.value) : 'No especificado',
    },
    {
      field: 'endDateH',
      headerName: 'Fecha de fin',
      flex: 1,
      valueGetter: (params) =>
        params.value ? convertUnixToDate(params.value) : 'Actual',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.5,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleModalOpen(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  const rows =
    userData.companyHistory?.map((history, index) => ({
      id: index,
      ...history,
    })) || [];

  return (
    <Box m="20px">
      <Typography
        variant="h4"
        gutterBottom
      >
        Historial de Empresas de {userData.name.first} {userData.name.last}
      </Typography>

      <Box
        mt="20px"
        height="60vh"
        sx={{
          '& .MuiDataGrid-columnHeaders': { backgroundColor: '#ff6600', color: '#' },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>

      <Box mt="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleModalOpen()}
        >
          Agregar Empresa
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ ml: '10px' }}
          onClick={() => nav(`/useredit/${control_number}`)}
        >
          Regresar a los detalles
        </Button>
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
      >
        <DialogTitle>
          {selectedHistory ? 'Editar Empresa' : 'Agregar Empresa'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Empresa"
            type="text"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Fecha de Inicio"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.startDateH}
            onChange={(e) => setFormData({ ...formData, startDateH: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Fecha de Fin"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.endDateH}
            onChange={(e) => setFormData({ ...formData, endDateH: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleModalClose}
            color="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
      >
        <DialogTitle>¿Estás seguro de eliminar esta empresa?</DialogTitle>
        <DialogContent>
          <Typography>
            Estás a punto de eliminar la empresa "{companyToDelete?.name}" del historial.
            Esta acción no se puede deshacer.
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
