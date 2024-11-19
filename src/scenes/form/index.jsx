import { useState } from 'react';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Snackbar,
  Alert,
  MenuItem,
} from '@mui/material';
import { Formik } from 'formik';
import { convertDateToUnix } from '../../services/utils';
import api from '../../services/apiService';
import {
  activityOptions,
  jobTypeOptions,
  employmentStatusOptions,
  sectorCategoryOptions,
  contactSourceOptions,
  participationTypeOptions,
} from '../../services/Titles';

const initialValues = {
  controlNumber: '',
  firstName: '',
  lastName: '',
  middleName: '',
  startDate: '',
  endDate: '',
  activity: '',
  companyName: '',
  city: '',
  municipality: '',
  state: '',
  position: '',
  yearsInPosition: '',
  jobType: '',
  employmentStatus: '',
  sectorCategory: '',
  sectorType: '',
  participation: '',
  contactSource: '',
};

const checkoutSchema = yup.object().shape({
  controlNumber: yup.string().required('Número de control es requerido'),
  firstName: yup.string().required('Nombre es requerido'),
  lastName: yup.string().required('Apellido es requerido'),
  middleName: yup.string().required('Apellido es requerido'),
  startDate: yup.date().nullable().required('Fecha de inicio es requerida'),
  endDate: yup.date().nullable().required('Fecha de fin es requerida'),
  activity: yup.string().required('Actividad es requerida'),
  companyName: yup.string().required('Nombre de la empresa es requerido'),
  city: yup.string().required('Ciudad es requerida'),
  municipality: yup.string().required('Municipio es requerido'),
  state: yup.string().required('Estado es requerido'),
  position: yup.string().required('Posición es requerida'),
  yearsInPosition: yup.number().required('Años en posición es requerido'),
  jobType: yup.string().required('Tipo de trabajo es requerido'),
  employmentStatus: yup.string().required('Estado de empleo es requerido'),
  sectorCategory: yup.string().required('Categoría de sector es requerida'),
  sectorType: yup.string().required('Tipo de sector es requerido'),
  participation: yup.string().required('Participación es requerida'),
  contactSource: yup.string().required('Fuente de contacto es requerida'),
});

const StudentForm = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const handleFormSubmit = async (values, actions) => {
    try {
      const payload = {
        control_number: values.controlNumber,
        name: {
          first: values.firstName,
          last: values.lastName,
          middle: values.middleName,
        },
        generation: {
          startDate: convertDateToUnix(values.startDate),
          endDate: convertDateToUnix(values.endDate),
        },
        activity: {
          activities: [values.activity],
        },
        company: {
          name: values.companyName,
          location: {
            city: values.city,
            municipality: values.municipality,
            state: values.state,
          },
          position: values.position,
          years_in_position: values.yearsInPosition,
          job_type: values.jobType,
        },
        employment_status: {
          type: [values.employmentStatus],
        },
        sector: {
          category: values.sectorCategory,
          type: values.sectorType,
        },
        participation: values.participation,
        contact_source: values.contactSource,
      };

      const response = await api.post('/api', payload);
      console.log('Student created:', response.data);

      setSnackbarMessage('Student created successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      actions.resetForm({ values: initialValues });
    } catch (error) {
      console.error('Error creating student:', error);
      setSnackbarMessage('Error creating student.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px">
      <h1>Crea un Estudiante</h1>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
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
              <TextField
                fullWidth
                variant="filled"
                label="Número de control"
                name="controlNumber"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.controlNumber}
                error={touched.controlNumber && Boolean(errors.controlNumber)}
                helperText={touched.controlNumber && errors.controlNumber}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Nombre"
                name="firstName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Apellido paterno"
                name="lastName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Apellido materno"
                name="middleName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.middleName}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                name="startDate"
                label="Fecha de Inicio"
                type="date"
                value={values.startDate}
                onChange={handleChange}
                error={touched.startDate && Boolean(errors.startDate)}
                helperText={touched.startDate && errors.startDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="endDate"
                label="Fecha de Fin"
                type="date"
                value={values.endDate}
                onChange={handleChange}
                error={touched.endDate && Boolean(errors.endDate)}
                helperText={touched.endDate && errors.endDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Actividad"
                name="activity"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.activity}
                error={touched.activity && Boolean(errors.activity)}
                helperText={touched.activity && errors.activity}
                sx={{ gridColumn: 'span 4' }}
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
              <TextField
                fullWidth
                variant="filled"
                label="Nombre de la empresa"
                name="companyName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyName}
                error={touched.companyName && Boolean(errors.companyName)}
                helperText={touched.companyName && errors.companyName}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Ciudad"
                name="city"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.city}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Municipio"
                name="municipality"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.municipality}
                error={touched.municipality && Boolean(errors.municipality)}
                helperText={touched.municipality && errors.municipality}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Estado"
                name="state"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.state}
                error={touched.state && Boolean(errors.state)}
                helperText={touched.state && errors.state}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Posición"
                name="position"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.position}
                error={touched.position && Boolean(errors.position)}
                helperText={touched.position && errors.position}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Años en posición"
                name="yearsInPosition"
                type="number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.yearsInPosition}
                error={touched.yearsInPosition && Boolean(errors.yearsInPosition)}
                helperText={touched.yearsInPosition && errors.yearsInPosition}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Tipo de trabajo"
                name="jobType"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.jobType}
                error={touched.jobType && Boolean(errors.jobType)}
                helperText={touched.jobType && errors.jobType}
                sx={{ gridColumn: 'span 2' }}
              >
                {jobTypeOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                label="Estado de empleo"
                name="employmentStatus"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.employmentStatus}
                error={touched.employmentStatus && Boolean(errors.employmentStatus)}
                helperText={touched.employmentStatus && errors.employmentStatus}
                sx={{ gridColumn: 'span 4' }}
              >
                {employmentStatusOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                label="Categoría de sector"
                name="sectorCategory"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.sectorCategory}
                error={touched.sectorCategory && Boolean(errors.sectorCategory)}
                helperText={touched.sectorCategory && errors.sectorCategory}
                sx={{ gridColumn: 'span 2' }}
              >
                {sectorCategoryOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                label="Tipo de sector"
                name="sectorType"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sectorType}
                error={touched.sectorType && Boolean(errors.sectorType)}
                helperText={touched.sectorType && errors.sectorType}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Participación"
                name="participation"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.participation}
                error={touched.participation && Boolean(errors.participation)}
                helperText={touched.participation && errors.participation}
                sx={{ gridColumn: 'span 4' }}
              >
                {participationTypeOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                label="Fuente de contacto"
                name="contactSource"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.contactSource}
                error={touched.contactSource && Boolean(errors.contactSource)}
                helperText={touched.contactSource && errors.contactSource}
                sx={{ gridColumn: 'span 4' }}
              >
                {contactSourceOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
              >
                Crear Estudiante
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default StudentForm;
