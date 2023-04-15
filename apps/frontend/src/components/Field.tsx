import { HTMLInputTypeAttribute } from "react";
import { Controller, ControllerProps, FieldValues } from "react-hook-form"

type FieldProps<Schema extends FieldValues = FieldValues> = {
    id: string;
    label: string;
    type?: HTMLInputTypeAttribute
} & Omit<ControllerProps<Schema>, 'render'>

export const Field = <Schema extends FieldValues = FieldValues>({
    label,
    id,
    type = "text",
    ...props
}: FieldProps<Schema>) => {
    return (
        <Controller<Schema>
            {...props}
            render={({ field }) => (
                <div className='flex flex-row items-center'>
                    <input className='mr-2' id={id} type={type} {...field} />
                    <label className='text-xl font-medium' htmlFor={id}>{label}</label>
                </div>
            )}
        />
    )
}