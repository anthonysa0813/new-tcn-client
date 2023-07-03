import { FormikErrors } from "formik";

interface FormValues {
  sectorName: string;
  sectorValue: string;
}

export const validateSkills = ({ sectorName, sectorValue }: FormValues) => {
  const errors: FormikErrors<FormValues> = {};

  if (!sectorName) {
    errors.sectorName = "Es requerido";
  }

  if (!sectorValue) {
    errors.sectorValue = "Es requerido";
  }

  return errors;
};
