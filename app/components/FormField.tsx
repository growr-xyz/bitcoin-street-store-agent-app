import { FieldInputProps, FieldMetaProps } from "formik";
import { twMerge } from "tailwind-merge";

interface FormFieldProps {
  inputProps: FieldInputProps<any>;
  meta: FieldMetaProps<any>;
  label: string;
  suffix?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  inputProps,
  meta,
  label,
  suffix,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={inputProps.name} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex flex-row justify-start items-center gap-2">
        <input
          {...inputProps}
          className={twMerge(
            "w-full border p-2 rounded focus:outline-orange-600",
            suffix ? "w-[calc(100%-40px)]" : ""
          )}
        />
        {suffix && (
          <div className="text-xs text-stone-500 w-[32px] text-right overflow-hidden overflow-ellipsis whitespace-nowrap">
            {suffix}
          </div>
        )}
      </div>
      {meta.touched && meta.error ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormField;
