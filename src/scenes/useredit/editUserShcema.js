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
  updatedAt: yup.string().nullable().required('Fecha de actualización es requerida'),
});

export default editUserSchema;
