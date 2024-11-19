import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import api from '../../services/apiService';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { Formik } from 'formik';
import { activityOptions } from '../../services/Titles';
import { convertDateToUnix, convertUnixToDate } from '../../services/utils';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const UserEdit = () => {
  const { control_number } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEditSubmit = async (values) => {
    try {
      const updatedValues = {
        ...values,
        generation: {
          startDate: convertDateToUnix(values.generation.startDate),
          endDate: convertDateToUnix(values.generation.endDate),
        },
      };

      const response = await api.put(`/api/${control_number}`, updatedValues);
      setSnackbarMessage('Usuario actualizado con éxito.');
      setSnackbarSeverity('success');
    } catch (err) {
      console.error('Error al actualizar el usuario:', err);
      setSnackbarMessage('Error al actualizar el usuario.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.object().shape({
      first: yup.string().required('El nombre es obligatorio.'),
      last: yup.string().required('El apellido es obligatorio.'),
      middle: yup.string().nullable(),
    }),
    generation: yup.object().shape({
      startDate: yup.date().required('La fecha de inicio es obligatoria.'),
      endDate: yup.date().required('La fecha de finalización es obligatoria.'),
    }),
    activity: yup.object().shape({
      activities: yup.array().of(yup.string()).required('La actividad es obligatoria.'),
    }),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/api/${control_number}`);
        setUserData(response.data);
      } catch (err) {
        setError('Error al cargar los datos del usuario.');
        setSnackbarMessage('Error al cargar los datos del usuario.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [control_number]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px">
      <h1>Ver y Editar Usuario</h1>

      <Formik
        initialValues={{
          control_number: userData?.control_number || '',
          name: {
            first: userData?.name.first || '',
            last: userData?.name.last || '',
            middle: userData?.name.middle || '',
          },
          generation: {
            startDate: userData?.generation.startDate
              ? convertUnixToDate(userData.generation.startDate)
              : '',
            endDate: userData?.generation.endDate
              ? convertUnixToDate(userData.generation.endDate)
              : '',
          },
          activity: {
            activities: userData?.activity.activities || [],
          },
        }}
        validationSchema={validationSchema}
        onSubmit={handleEditSubmit}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                '& > div': {
                  gridColumn: isNonMobile ? undefined : 'span 4',
                },
              }}
            >
              <ConfirmationDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => {
                  setConfirmOpen(false);
                  handleEditSubmit(values);
                }}
                title="¿Estás seguro de guardar los cambios?"
                description="Se actualizarán los datos del estudiante en el sistema."
                confirmText="Guardar"
                cancelText="Cancelar"
              />
              {/* Campo no editable */}
              <TextField
                name="control_number"
                label="Número de Control"
                value={values.control_number}
                disabled
                fullWidth
              />
              {/* Campos editables */}
              <TextField
                name="name.first"
                label="Nombre"
                value={values.name.first}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="name.last"
                label="Apellido"
                value={values.name.last}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="name.middle"
                label="Segundo Nombre"
                value={values.name.middle}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="generation.startDate"
                label="Fecha de Inicio"
                type="date"
                value={values.generation.startDate}
                onChange={(e) => setFieldValue('generation.startDate', e.target.value)}
                fullWidth
              />
              <TextField
                name="generation.endDate"
                label="Fecha de Finalización"
                type="date"
                value={values.generation.endDate}
                onChange={(e) => setFieldValue('generation.endDate', e.target.value)}
                fullWidth
              />
              <TextField
                select
                name="activity.activities"
                label="Actividades"
                value={values.activity.activities}
                onChange={(e) =>
                  setFieldValue(
                    'activity.activities',
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                fullWidth
                SelectProps={{
                  multiple: true,
                }}
              >
                {activityOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {/* Otros campos no editables */}
              {Object.keys(userData)
                .filter(
                  (key) =>
                    !['control_number', 'name', 'generation', 'activity'].includes(key)
                )
                .map((key) => (
                  <TextField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={userData[key]}
                    disabled
                    fullWidth
                  />
                ))}
            </Box>
            <Box
              display="flex"
              justifyContent="end"
              mt="20px"
            >
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                onClick={() => setConfirmOpen(true)}
              >
                Guardar Cambios
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserEdit;
