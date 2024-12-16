import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import Loader from '../../components/Loader';
import api from '../../services/apiService';
import { convertDateToUnix, convertUnixToDate } from '../../services/utils';
import editUserSchema from './editUserShcema';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import {
  useMediaQuery,
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
} from '@mui/material';
import {
  activites,
  activityOptions,
  employmentStatusOptions,
  contactSourceOptions,
  institucionOptions,
  sectorOptions,
  participationTypeOptions,
  updateAtOptions,
} from '../../services/Titles';

const UserEdit = () => {
  const { control_number } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const nav = useNavigate();
  const [contact_source_original, setContactSourceOriginal] = useState('');

  const handleEditSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
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
        contact_source:
          values.contactSource === 'otro' ? values.otherSource : values.contactSource,
        updatedAt: values.updatedAt,
      };

      const response = await api.put(`/api/${values.controlNumber}`, payload);

      setSnackbarMessage('Datos del usuario actualizados con éxito!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);

      setSnackbarMessage('Error al actualizar los datos del usuario.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);

      setLoading(false);
    }
  };

  const handleConfirmEdit = (values) => {
    setOpenConfirmDialog(false);
    handleEditSubmit(values);
  };

  const handleCancelEdit = () => {
    setOpenConfirmDialog(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`api/${control_number}`);
        setUserData(response.data);
        console.log(response.data);
        setContactSourceOriginal(response.data.contact_source);
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

  if (loading) return <Loader loading={loading} />;
  if (error) return <div>{error}</div>;

  return (
    <Box m="20px">
      <h1>Ver y Editar Egresado</h1>

      <Formik
        enableReinitialize={true}
        initialValues={{
          controlNumber: userData?.control_number || '',
          firstName: userData?.name?.first || '',
          lastName: userData?.name?.last || '',
          middleName: userData?.name?.middle || '',
          career: userData?.career || '',
          startDate: userData?.generation?.startDate
            ? convertUnixToDate(userData?.generation?.startDate)
            : '',
          endDate: userData?.generation?.endDate
            ? convertUnixToDate(userData?.generation?.endDate)
            : '',
          email: userData?.email || '',
          activity: userData?.activity?.activities[0] || '',
          companyName: userData?.company?.name || '',
          city: userData?.company?.location?.city || '',
          municipality: userData?.company?.location?.municipality || '',
          state: userData?.company?.location?.state || '',
          position: userData?.company?.position || '',
          yearsInPosition: userData?.company?.years_in_position || '',
          hierarchical_level: userData?.company?.hierarchical_level || '',
          startDateC: userData?.company?.startDateC || '',
          endDateC: userData?.company?.endDateC || '',
          name: userData?.companyHistory?.name || '',
          startDateH: userData?.companyHistory?.startDateH || '',
          endDateH: userData?.companyHistory?.endDateH || '',
          working_condition: userData?.working_condition?.type || '',
          sector: userData?.sector || '',
          institution: userData?.institution || '',
          profile: userData?.profile || '',
          contactSource: userData?.contact_source || '',
          otherSource: userData?.contact_source || '',
          updatedAt: userData?.updatedAt || '',
        }}
        validationSchema={editUserSchema}
        onSubmit={(values) => {
          setOpenConfirmDialog(true);
        }}
      >
        {({ values, handleChange, handleSubmit, errors, touched, setFieldValue }) => (
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
                label="Número de Control"
                value={values.controlNumber}
                onChange={handleChange}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                label="Nombre"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Apellido Paterno"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Apellido Materno"
                name="middleName"
                value={values.middleName}
                onChange={handleChange}
                error={touched.middleName && Boolean(errors.middleName)}
                helperText={touched.middleName && errors.middleName}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Carrera"
                name="career"
                value={values.career}
                onChange={handleChange}
                error={touched.career && Boolean(errors.career)}
                helperText={touched.career && errors.career}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Fecha de ingreso al ITSH"
                name="startDate"
                type="date"
                value={values.startDate}
                onChange={(e) => setFieldValue('startDate', e.target.value)}
                error={touched.startDate && Boolean(errors.startDate)}
                helperText={touched.startDate && errors.startDate}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Fecha de egreso del ITSH"
                name="endDate"
                type="date"
                value={values.endDate}
                onChange={(e) => setFieldValue('endDate', e.target.value)}
                error={touched.endDate && Boolean(errors.endDate)}
                helperText={touched.endDate && errors.endDate}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Correo"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Actividad"
                name="activity"
                onChange={handleChange}
                select
                value={values.activity}
                error={touched.activity && Boolean(errors.activity)}
                helperText={touched.activity && errors.activity}
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
                label="Empresa"
                name="companyName"
                value={values.companyName}
                onChange={handleChange}
                error={touched.companyName && Boolean(errors.companyName)}
                helperText={touched.companyName && errors.companyName}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Ciudad"
                name="city"
                value={values.city}
                onChange={handleChange}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Municipio"
                name="municipality"
                value={values.municipality}
                onChange={handleChange}
                error={touched.municipality && Boolean(errors.municipality)}
                helperText={touched.municipality && errors.municipality}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Estado"
                name="state"
                value={values.state}
                onChange={handleChange}
                error={touched.state && Boolean(errors.state)}
                helperText={touched.state && errors.state}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Puesto"
                name="position"
                value={values.position}
                onChange={handleChange}
                error={touched.position && Boolean(errors.position)}
                helperText={touched.position && errors.position}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Antiguedad"
                name="yearsInPosition"
                value={values.yearsInPosition}
                onChange={handleChange}
                error={touched.yearsInPosition && Boolean(errors.yearsInPosition)}
                helperText={touched.yearsInPosition && errors.yearsInPosition}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Nivel jerárquico"
                name="hierarchical_level"
                value={values.hierarchical_level}
                onChange={handleChange}
                select
                error={touched.hierarchical_level && Boolean(errors.hierarchical_level)}
                helperText={touched.hierarchical_level && errors.hierarchical_level}
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
                value={values.working_condition}
                onChange={handleChange}
                select
                error={touched.working_condition && Boolean(errors.working_condition)}
                helperText={touched.working_condition && errors.working_condition}
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
                value={values.sector}
                onChange={handleChange}
                select
                error={touched.sector && Boolean(errors.sector)}
                helperText={touched.sector && errors.sector}
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
                value={values.institution}
                onChange={handleChange}
                select
                error={touched.institution && Boolean(errors.institution)}
                helperText={touched.institution && errors.institution}
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
                value={values.profile}
                onChange={handleChange}
                select
                error={touched.profile && Boolean(errors.profile)}
                helperText={touched.profile && errors.profile}
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
                label="Fuente de contacto original"
                value={contact_source_original}
                onChange={handleChange}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                label="Fuente de contacto"
                name="contactSource"
                value={values.contactSource}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value === 'otro') {
                    setFieldValue('otherSource', userData?.otherSource || '');
                  } else {
                    setFieldValue('otherSource', '');
                  }
                }}
                select
                error={touched.contactSource && Boolean(errors.contactSource)}
                helperText={touched.contactSource && errors.contactSource}
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

              {values.contactSource === 'otro' && (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Especifica la fuente de contacto"
                  name="otherSource"
                  onChange={handleChange}
                  value={values.otherSource}
                  error={touched.otherSource && Boolean(errors.otherSource)}
                  helperText={touched.otherSource && errors.otherSource}
                />
              )}

              <TextField
                fullWidth
                variant="filled"
                label="Fecha de actualización"
                name="updatedAt"
                onChange={handleChange}
                select
                value={values.updatedAt}
                error={touched.updatedAt && Boolean(errors.updatedAt)}
                helperText={touched.updatedAt && errors.updatedAt}
              >
                {updateAtOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                onClick={() => nav(`/companyhistory/${control_number}`)}
                color="secondary"
                variant="contained"
              >
                Ver historial de empresas
              </Button>
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
                Guardar Cambios
              </Button>
            </Box>
            {Object.keys(errors).length > 0 && (
              <Box
                mt="20px"
                color="red"
              >
                {Object.values(errors).map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </Box>
            )}
            <ConfirmationDialog
              open={openConfirmDialog}
              onClose={handleCancelEdit}
              onConfirm={() => handleConfirmEdit(values)}
              title="Confirmar cambios"
              description="¿Estás seguro de que deseas guardar estos cambios?"
              confirmText="Confirmar"
              cancelText="Cancelar"
            />
          </form>
        )}
      </Formik>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={3000}
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
