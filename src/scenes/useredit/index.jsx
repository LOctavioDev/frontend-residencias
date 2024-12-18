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
  tituloOptions,
  postgradeOptions,
  genderOptions,
  maritalStatusOptions,
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
        birthdate: convertDateToUnix(values.birthDate),
        curp: values.curp,
        marital_status: values.marital_status,
        gender: values.gender,
        home_address: values.home_address,
        cp: values.cp,
        student_city: values.student_city,
        student_municipality: values.student_municipality,
        student_state: values.student_state,
        phone: values.phone,
        certificate: values.certificate,
        graduation_date: convertDateToUnix(values.graduation_date),
        graduation_option: values.graduation_option,
        post_graduation: values.post_graduation,
        company: {
          name: values.companyName,
          boss_name: values.boss_name,
          boss_position: values.boss_position,
          company_address: values.company_address,
          company_cp: values.company_cp,
          company_phone: values.company_phone,
          fax: values.fax,
          company_email: values.company_email,
          salary: values.salary,
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
        studentAt: values.studentAt,
        updatedAt: values.updateAt,
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
        console.log(response.data);
        setUserData(response.data);
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
          birthDate: userData?.birthdate ? convertUnixToDate(userData?.birthdate) : '',
          curp: userData?.curp || '',
          marital_status: userData?.marital_status || '',
          gender: userData?.gender || '',
          home_address: userData?.home_address || '',
          cp: userData?.cp || '',
          student_city: userData?.student_city || '',
          student_municipality: userData?.student_municipality || '',
          student_state: userData?.student_state || '',
          phone: userData?.phone || '',
          certificate: userData?.certificate || '',
          graduation_date: userData?.graduation_date
            ? convertUnixToDate(userData?.graduation_date)
            : '',
          graduation_option: userData?.graduation_option || '',
          post_graduation: userData?.post_graduation || '',
          companyName: userData?.company?.name || '',
          city: userData?.company?.location?.city || '',
          municipality: userData?.company?.location?.municipality || '',
          state: userData?.company?.location?.state || '',
          position: userData?.company?.position || '',
          yearsInPosition: userData?.company?.years_in_position || '',
          hierarchical_level: userData?.company?.hierarchical_level || '',
          boss_name: userData?.company?.boss_name || '',
          boss_position: userData?.company?.boss_position || '',
          company_address: userData?.company?.company_address || '',
          company_cp: userData?.company?.company_cp || '',
          company_phone: userData?.company?.company_phone || '',
          fax: userData?.company?.fax || '',
          company_email: userData?.company?.company_email || '',
          salary: userData?.company?.salary || '',
          // startDateC: userData?.company?.startDateC || '',
          // endDateC: userData?.company?.endDateC || '',
          name: userData?.companyHistory?.name || '',
          startDateH: userData?.companyHistory?.startDateH || '',
          endDateH: userData?.companyHistory?.endDateH || '',
          working_condition: userData?.working_condition?.type || '',
          sector: userData?.sector || '',
          institution: userData?.institution || '',
          profile: userData?.profile || '',
          contactSource: userData?.contact_source || '',
          otherSource: userData?.contact_source || '',
          studentAt: userData?.studentAt || '',
          updateAt: userData?.updatedAt || '',
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
                label="Última Actualización"
                name="updateAt"
                type="date"
                onChange={(e) => setFieldValue('updateAt', e.target.value)}
                value={
                  values.updateAt
                    ? new Date(values.updateAt).toISOString().split('T')[0]
                    : ''
                }
                sx={{
                  backgroundColor: '#f0f0f0',
                  color: '#000',
                }}
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
                label="Fecha de nacimiento"
                name="birthDate"
                type="date"
                value={values.birthDate}
                onChange={(e) => setFieldValue('birthDate', e.target.value)}
                error={touched.birthDate && Boolean(errors.birthDate)}
                helperText={touched.birthDate && errors.birthDate}
              />
              <TextField
                fullWidth
                variant="filled"
                label="CURP"
                name="curp"
                value={values.curp}
                onChange={handleChange}
                error={touched.curp && Boolean(errors.curp)}
                helperText={touched.curp && errors.curp}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Estado Civil"
                name="marital_status"
                value={values.marital_status}
                onChange={handleChange}
                select
                error={touched.marital_status && Boolean(errors.marital_status)}
                helperText={touched.marital_status && errors.marital_status}
              >
                {maritalStatusOptions.map((option) => (
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
                label="Genero"
                name="gender"
                value={values.gender}
                onChange={handleChange}
                select
                error={touched.gender && Boolean(errors.gender)}
                helperText={touched.gender && errors.gender}
              >
                {genderOptions.map((option) => (
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
                label="Domicilio"
                name="home_address"
                value={values.home_address}
                onChange={handleChange}
                error={touched.home_address && Boolean(errors.home_address)}
                helperText={touched.home_address && errors.home_address}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Código Postal"
                name="cp"
                value={values.cp}
                onChange={handleChange}
                error={touched.cp && Boolean(errors.cp)}
                helperText={touched.cp && errors.cp}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Ciudad de residencia"
                name="student_city"
                value={values.student_city}
                onChange={handleChange}
                error={touched.student_city && Boolean(errors.student_city)}
                helperText={touched.student_city && errors.student_city}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Municipio de residencia"
                name="student_municipality"
                value={values.student_municipality}
                onChange={handleChange}
                error={
                  touched.student_municipality && Boolean(errors.student_municipality)
                }
                helperText={touched.student_municipality && errors.student_municipality}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Estado de residencia"
                name="student_state"
                value={values.student_state}
                onChange={handleChange}
                error={touched.student_state && Boolean(errors.student_state)}
                helperText={touched.student_state && errors.student_state}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Número de teléfono"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Titulados"
                name="certificate"
                value={values.certificate}
                onChange={handleChange}
                select
                error={touched.certificate && Boolean(errors.certificate)}
                helperText={touched.certificate && errors.certificate}
              >
                {tituloOptions.map((option) => (
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
                label="Fecha de titulación"
                name="graduation_date"
                type="date"
                value={values.graduation_date}
                onChange={(e) => setFieldValue('graduation_date', e.target.value)}
                error={touched.graduation_date && Boolean(errors.graduation_date)}
                helperText={touched.graduation_date && errors.graduation_date}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Postgrado"
                name="postgrade"
                value={values.postgrade}
                onChange={handleChange}
                select
                error={touched.postgrade && Boolean(errors.postgrade)}
                helperText={touched.postgrade && errors.postgrade}
              >
                {postgradeOptions.map((option) => (
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
                label="Opcion de titulación"
                name="graduation_option"
                value={values.graduation_option}
                onChange={handleChange}
                error={touched.graduation_option && Boolean(errors.graduation_option)}
                helperText={touched.graduation_option && errors.graduation_option}
              />

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
                label="Nombre del jefe inmediato"
                name="boss_name"
                value={values.boss_name}
                onChange={handleChange}
                error={touched.boss_name && Boolean(errors.boss_name)}
                helperText={touched.boss_name && errors.boss_name}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Posición del jefe inmediato"
                name="boss_position"
                value={values.boss_position}
                onChange={handleChange}
                error={touched.boss_position && Boolean(errors.boss_position)}
                helperText={touched.boss_position && errors.boss_position}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Dirección de la empresa"
                name="company_address"
                value={values.company_address}
                onChange={handleChange}
                error={touched.company_address && Boolean(errors.company_address)}
                helperText={touched.company_address && errors.company_address}
              />

              <TextField
                fullWidth
                variant="filled"
                label="CP"
                name="cp"
                value={values.cp}
                onChange={handleChange}
                error={touched.cp && Boolean(errors.cp)}
                helperText={touched.cp && errors.cp}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Teléfono de la empresa"
                name="company_phone"
                value={values.company_phone}
                onChange={handleChange}
                error={touched.company_phone && Boolean(errors.company_phone)}
                helperText={touched.company_phone && errors.company_phone}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Fax"
                name="fax"
                value={values.fax}
                onChange={handleChange}
                error={touched.fax && Boolean(errors.fax)}
                helperText={touched.fax && errors.fax}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Correo de la empresa"
                name="company_email"
                value={values.company_email}
                onChange={handleChange}
                error={touched.company_email && Boolean(errors.company_email)}
                helperText={touched.company_email && errors.company_email}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Salario"
                name="salary"
                value={values.salary}
                onChange={handleChange}
                error={touched.salary && Boolean(errors.salary)}
                helperText={touched.salary && errors.salary}
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
                label="Trabajo obtenido de actual"
                value={contact_source_original}
                onChange={handleChange}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                label="Trabajo obtenido de"
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
                label="Alumnos actualizados"
                name="studentAt"
                onChange={handleChange}
                select
                value={values.studentAt}
                error={touched.studentAt && Boolean(errors.studentAt)}
                helperText={touched.studentAt && errors.studentAt}
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
