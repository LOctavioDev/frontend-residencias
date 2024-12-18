import * as yup from 'yup';

const editUserSchema = yup.object().shape({
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
    .string()
    .min(0, 'El salario debe ser mayor o igual a 0')
    .required('Salario es requerido'),
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
  otherSource: yup
    .string()
    .nullable()
    .when('contactSource', (contactSource, schema) => {
      if (contactSource === 'otro') {
        return schema.required('Especifica la fuente de trabajo');
      }
      return schema.notRequired();
    }),
  studentAt: yup.string().nullable().required('Alumnos actualizados es requerida'),
});

export default editUserSchema;
