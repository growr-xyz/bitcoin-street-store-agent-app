import { FieldInputProps, FieldMetaProps } from "formik";
import { twMerge } from "tailwind-merge";

interface FormFieldProps {
  inputProps: FieldInputProps<any>;
  meta: FieldMetaProps<any>;
  className?: string;
  label: string;
  suffix?: string;
  button?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  inputProps,
  meta,
  className,
  label,
  suffix,
  button,
}) => {
  return (
    <div className={twMerge("flex-grow flex flex-col space-y-1", className)}>
      <label htmlFor={inputProps.name} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex flex-row justify-start items-center gap-2">
        <input
          {...inputProps}
          className="flex-grow border p-2 rounded focus:outline-orange-900"
        />
        {suffix && (
          <div className="text-xs text-stone-500 min-w-fit text-right overflow-hidden overflow-ellipsis whitespace-nowrap">
            {suffix}
          </div>
        )}
        {button && button}
      </div>
      {meta.touched && meta.error ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormField;
