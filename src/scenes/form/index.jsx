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
  updateAtOptions,
  tituloOptions,
  postgradeOptions,
  genderOptions,
  maritalStatusOptions,
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
  birthDate: '',
  curp: '',
  marital_status: '',
  gender: '',
  home_address: '',
  cp: '',
  student_city: '',
  student_municipality: '',
  student_state: '',
  phone: '',
  certificate: '',
  graduation_date: '',
  graduation_option: '',
  post_graduation: '',
  companyName: '',
  city: '',
  municipality: '',
  state: '',
  position: '',
  yearsInPosition: '', 
  hierarchical_level: '',
  name: '',
  boss_name: '',
  boss_position: '',
  company_address: '',
  company_cp: '',
  company_phone: '',
  fax: '',
  company_email: '',
  salary: '',
  startDateH: '',
  endDateH: '',
  working_condition: '',
  sector: '',
  institution: '',
  profile: '',
  contactSource: '',
  otherSource: '',
  studentAt: '', 
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
  birthDate: yup.date().nullable().required('Fecha de nacimiento es requerida'),
  curp: yup
    .string()
    .max(18, 'CURP debe tener 18 caracteres')
    .required('CURP es requerido'),
  marital_status: yup.string().required('Estado civil es requerido'),
  gender: yup.string().required('Genero es requerido'),
  home_address: yup.string().required('Direccion de residencia es requerida'),
  cp: yup.string().required('Código postal es requerido'),
  student_city: yup.string().required('Ciudad es requerida'),
  student_municipality: yup.string().required('Municipio es requerido'),
  student_state: yup.string().required('Estado es requerido'),
  phone: yup.string().required('Telefono es requerido'),
  certificate: yup.string().required('Certificado es requerido'),
  graduation_date: yup.date().nullable().required('Fecha de graduación es requerida'),
  graduation_option: yup.string().required('Opcion de graduación es requerida'),
  post_graduation: yup.string().required('Post graduación es requerida'),
  boss_name: yup.string().required('Nombre del jefe es requerido'),
  boss_position: yup.string().required('Posición del jefe es requerido'),
  company_address: yup.string().required('Direccion de la empresa es requerida'),
  company_cp: yup.string().required('Código postal es requerido'),
  company_phone: yup.string().required('Telefono de la empresa es requerido'),
  fax: yup.string().required('Fax es requerido'),
  company_email: yup
  .string()
  .email('Correo electronico no válido')
  .required('Correo de la empresa es requerido'),
  salary: yup
  .number()
  .min(0, 'El salario debe ser mayor o igual a 0')
  .transform((value) => parseFloat(value))
  .required('Salario es requerido'),
  companyName: yup.string().required('Nombre de la empresa es requerido'),
  city: yup.string().required('Ciudad es requerida'),
  municipality: yup.string().required('Municipio es requerido'),
  state: yup.string().required('Estado es requerido'),
  position: yup.string().required('Posición es requerida'),
  yearsInPosition: yup
    .number()
    .min(0, 'El número de años en antiguedad debe ser mayor o igual a 0'),
  hierarchical_level: yup.string().required('Nivel jerárquico es requerido'),
  working_condition: yup.string().required('Condición de trabajo es requerida'),
  sector: yup.string().required('Sector es requerida'),
  institution: yup.string().required('Institución es requerida'),
  profile: yup.string().required('Perfil es requerido'),
  contactSource: yup.string().required('Selecciona una fuente'),
  otherSource: yup
    .string()
    .nullable()
    .when('contactSource', (contactSource, schema) => {
      if (contactSource === 'otro') {
        return schema.required('Especifica la fuente de trabajo');
      }
      return schema.notRequired();
    }),
    studentAt: yup.string().nullable().required('Fecha de actualización es requerida'),
});

const StudentForm = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const [isHistory, setIsHistory] = useState(false);

  const handleHistory = () => {
    setIsHistory(!isHistory);
  };

  const handleFormSubmit = async (values, actions) => {
    console.log(values);
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
        companyHistory: [
          {
            name: values.name,
            startDateH: convertDateToUnix(values.startDate),
            endDateH: convertDateToUnix(values.endDate),
          },
        ],
        working_condition: {
          type: values.working_condition,
        },
        sector: values.sector,
        institution: values.institution,
        profile: values.profile,
        contact_source:
          values.contactSource === 'otro' ? values.otherSource : values.contactSource,
          studentAt: values.studentAt,
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
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
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
                label="Fecha de ingreso al ITSH"
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
                label="Fecha de egreso del ITSH"
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
                name="birthDate"
                label="Fecha de nacimiento"
                type="date"
                value={values.birthDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="CURP"
                name="curp"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.curp}
                error={touched.curp && Boolean(errors.curp)}
                helperText={touched.curp && errors.curp}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Estado Civil"
                name="marital_status"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.marital_status}
                error={touched.marital_status && Boolean(errors.marital_status)}
                helperText={touched.marital_status && errors.marital_status}
                sx={{ gridColumn: 'span 2' }}
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
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.gender}
                error={touched.gender && Boolean(errors.gender)}
                helperText={touched.gender && errors.gender}
                sx={{ gridColumn: 'span 2' }}
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
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.home_address}
                error={touched.home_address && Boolean(errors.home_address)}
                helperText={touched.home_address && errors.home_address}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Código postal"
                name="cp"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cp}
                error={touched.cp && Boolean(errors.cp)}
                helperText={touched.cp && errors.cp}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Ciudad de residencia"
                name="student_city"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.student_city}
                error={touched.student_city && Boolean(errors.student_city)}
                helperText={touched.student_city && errors.student_city}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Municipio de residencia"
                name="student_municipality"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.student_municipality}
                error={
                  touched.student_municipality && Boolean(errors.student_municipality)
                }
                helperText={touched.student_municipality && errors.student_municipality}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Estado de residencia"
                name="student_state"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.student_state}
                error={touched.student_state && Boolean(errors.student_state)}
                helperText={touched.student_state && errors.student_state}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Número de teléfono"
                name="phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Titulados"
                name="certificate"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.certificate}
                error={touched.certificate && Boolean(errors.certificate)}
                helperText={touched.certificate && errors.certificate}
                sx={{ gridColumn: 'span 2' }}
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
                label="Fecha de graduación"
                name="graduation_date"
                type="date"
                value={values.graduation_date}
                onChange={handleChange}
                error={touched.graduation_date && Boolean(errors.graduation_date)}
                helperText={touched.graduation_date && errors.graduation_date}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Posgrado"
                name="post_graduation"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.post_graduation}
                error={touched.post_graduation && Boolean(errors.post_graduation)}
                helperText={touched.post_graduation && errors.post_graduation}
                sx={{ gridColumn: 'span 2' }}
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
                label="Opción de titulación"
                name="graduation_option"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.graduation_option}
                error={touched.graduation_option && Boolean(errors.graduation_option)}
                helperText={touched.graduation_option && errors.graduation_option}
                sx={{ gridColumn: 'span 2' }}
              />

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
                label="Antigüedad"
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
                label="Nombre del jefe inmediato"
                name="boss_name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.boss_name}
                error={touched.boss_name && Boolean(errors.boss_name)}
                helperText={touched.boss_name && errors.boss_name}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Cargo del jefe inmediato"
                name="boss_position"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.boss_position}
                error={touched.boss_position && Boolean(errors.boss_position)}
                helperText={touched.boss_position && errors.boss_position}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Dirección de la empresa"
                name="company_address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.company_address}
                error={touched.company_address && Boolean(errors.company_address)}
                helperText={touched.company_address && errors.company_address}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Código postal de la empresa"
                name="company_cp"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.company_cp}
                error={touched.company_cp && Boolean(errors.company_cp)}
                helperText={touched.company_cp && errors.company_cp}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Teléfono de la empresa"
                name="company_phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.company_phone}
                error={touched.company_phone && Boolean(errors.company_phone)}
                helperText={touched.company_phone && errors.company_phone}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Fax"
                name="fax"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fax}
                error={touched.fax && Boolean(errors.fax)}
                helperText={touched.fax && errors.fax}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Correo de la empresa"
                name="company_email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.company_email}
                error={touched.company_email && Boolean(errors.company_email)}
                helperText={touched.company_email && errors.company_email}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Salario"
                name="salary"
                type="number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salary}
                error={touched.salary && Boolean(errors.salary)}
                helperText={touched.salary && errors.salary}
                sx={{ gridColumn: 'span 2' }}
              />

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
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value === 'otro') {
                    setFieldValue('otherSource', '');
                  }
                }}
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

              {values.contactSource === 'otro' && (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Especifica la fuente de trabajo"
                  name="otherSource"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.otherSource}
                  error={touched.otherSource && Boolean(errors.otherSource)}
                  helperText={touched.otherSource && errors.otherSource}
                  sx={{ gridColumn: 'span 2' }}
                />
              )}

              <TextField
                fullWidth
                variant="filled"
                label="Alumnos actualizados"
                name="studentAt"
                onBlur={handleBlur}
                onChange={handleChange}
                select
                value={values.studentAt}
                error={touched.studentAt && Boolean(errors.studentAt)}
                helperText={touched.studentAt && errors.studentAt}
                sx={{ gridColumn: 'span 4' }}
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
                onClick={handleHistory}
                color="secondary"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Agregar al historial
              </Button>

              {isHistory && (
                <>
                  <TextField
                    fullWidth
                    variant="filled"
                    name="name"
                    label="Nombre de la anterior empresa"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{ gridColumn: 'span 4' }}
                  />

                  <TextField
                    name="startDateH"
                    label="Fecha de inicio de la empresa"
                    type="date"
                    value={values.startDateH}
                    onChange={handleChange}
                    error={touched.startDateH && Boolean(errors.startDateH)}
                    helperText={touched.startDateH && errors.startDateH}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ gridColumn: 'span 2' }}
                  />

                  <TextField
                    name="endDateH"
                    label="Fecha de fin de la empresa"
                    type="date"
                    value={values.endDateH}
                    onChange={handleChange}
                    error={touched.endDateH && Boolean(errors.endDateH)}
                    helperText={touched.endDateH && errors.endDateH}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ gridColumn: 'span 2' }}
                  />
                </>
              )}
            </Box>

            <Box
              display="flex"
              justifyContent="end"
              mt="20px"
            >
              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{ mr: 1 }}
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
