import { FieldInputProps, FieldMetaProps } from "formik";

interface FormFieldProps {
  inputProps: FieldInputProps<any>;
  meta: FieldMetaProps<any>;
  label: string;
}

const FormField: React.FC<FormFieldProps> = ({ inputProps, meta, label }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={inputProps.name} className="text-sm font-medium">
        {label}
      </label>
      <input {...inputProps} className="border p-2 rounded" />
      {meta.touched && meta.error ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormField;
