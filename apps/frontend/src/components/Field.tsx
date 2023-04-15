import { HTMLInputTypeAttribute } from "react";
import { Controller, ControllerProps } from "react-hook-form"

type FieldProps = {
    id: string;
    label: string;
    type?: HTMLInputTypeAttribute
} & Omit<ControllerProps, 'render'>

export const Field = ({
    label,
    id,
    type = "text",
    ...props
}: FieldProps) => {
    return (
        <Controller
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