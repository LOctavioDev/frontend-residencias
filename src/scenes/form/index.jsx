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
  institucionOptions,
  employmentStatusOptions,
  sectorOptions,
  contactSourceOptions,
  participationTypeOptions,
  activites,
} from '../../services/Titles';

const initialValues = {
  controlNumber: '',
  career: '',
  firstName: '',
  lastName: '',
  middleName: '',
  startDate: '',
  endDate: '',
  email: '',
  activity: '',
  companyName: '',
  city: '',
  municipality: '',
  state: '',
  position: '',
  yearsInPosition: '',
  hierarchical_level: '',
  working_condition: '',
  sector: '',
  institution: '',
  profile: '',
  contactSource: '',
};

const checkoutSchema = yup.object().shape({
  controlNumber: yup.string().required('Número de control es requerido'),
  career: yup.string().required('Carrera es requerida'),
  firstName: yup.string().required('Nombre es requerido'),
  lastName: yup.string().required('Apellido es requerido'),
  middleName: yup.string().required('Apellido es requerido'),
  startDate: yup.date().nullable().required('Fecha de inicio es requerida'),
  endDate: yup.date().nullable().required('Fecha de fin es requerida'),
  email: yup
    .string()
    .email('Correo electronico no válido')
    .required('Correo electrónico es requerido'),
  activity: yup.string().required('Actividad es requerida'),
  companyName: yup.string().required('Nombre de la empresa es requerido'),
  city: yup.string().required('Ciudad es requerida'),
  municipality: yup.string().required('Municipio es requerido'),
  state: yup.string().required('Estado es requerido'),
  position: yup.string().required('Posición es requerida'),
  yearsInPosition: yup
    .number()
    .required('Años en posición es requerido')
    .min(0, 'El número de años en antiguedad debe ser mayor o igual a 0'),
  hierarchical_level: yup.string().required('Nivel jerárquico es requerido'),
  working_condition: yup.string().required('Condición de trabajo es requerida'),
  sector: yup.string().required('Sector es requerida'),
  institution: yup.string().required('Institución es requerida'),
  profile: yup.string().required('Perfil es requerido'),
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
        career: values.career,
        name: {
          first: values.firstName,
          last: values.lastName,
          middle: values.middleName,
        },
        generation: {
          startDate: convertDateToUnix(values.startDate),
          endDate: convertDateToUnix(values.endDate),
        },
        email: values.email,
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
          hierarchical_level: values.hierarchical_level,
        },
        working_condition: {
          type: values.working_condition,
        },
        sector: values.sector,
        institution: values.institution,
        profile: values.profile,
        contact_source: values.contactSource,
      };

      console.log(payload);
      const response = await api.post('/api', payload);

      setSnackbarMessage('Egresado creado con éxito!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      actions.resetForm({ values: initialValues });
    } catch (error) {
      console.error('Error al crear el estudiante:', error);
      setSnackbarMessage('Error al crear el estudiant.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px">
      <h1>Crea un egresado</h1>
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
                label="Carrera"
                name="career"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.career}
                error={touched.career && Boolean(errors.career)}
                helperText={touched.career && errors.career}
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
                label="Fecha de ingreso"
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
                label="Fecha de egreso"
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
                label="Correo Electronico"
                type="email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Actividad a la que se dedica actualmente"
                name="activity"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.activity}
                error={touched.activity && Boolean(errors.activity)}
                helperText={touched.activity && errors.activity}
                sx={{ gridColumn: 'span 4' }}
              >
                {activites.map((option) => (
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
                label="Puesto"
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
                label="antigüedad"
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
                label="Nivel jerárquico"
                name="hierarchical_level"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.hierarchical_level}
                error={touched.hierarchical_level && Boolean(errors.hierarchical_level)}
                helperText={touched.hierarchical_level && errors.hierarchical_level}
                sx={{ gridColumn: 'span 2' }}
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
                label="Condición de trabajo"
                name="working_condition"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.working_condition}
                error={touched.working_condition && Boolean(errors.working_condition)}
                helperText={touched.working_condition && errors.working_condition}
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
                label="Sector"
                name="sector"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.sector}
                error={touched.sector && Boolean(errors.sector)}
                helperText={touched.sector && errors.sector}
                sx={{ gridColumn: 'span 2' }}
              >
                {sectorOptions.map((option) => (
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
                label="Institución"
                name="institution"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.institution}
                error={touched.institution && Boolean(errors.institution)}
                helperText={touched.institution && errors.institution}
                sx={{ gridColumn: 'span 2' }}
              >
                {institucionOptions.map((option) => (
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
                label="Perfil"
                name="profile"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.profile}
                error={touched.profile && Boolean(errors.profile)}
                helperText={touched.profile && errors.profile}
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
                label="Trabajo obtenido de"
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
                Crear egresado
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
