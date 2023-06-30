
import { Field, } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, Input, Select, } from '@chakra-ui/react';

type FormFieldProps = {
    name: string;
    placeholder: string;
    type?: string,
    options?: string[]
};

type FieldProps = {
    field: any;
    form: any
}

const FormField = ({ name, placeholder, type, options }: FormFieldProps) => {

    return (
        <Field name={name} >
            {({ field, form }: FieldProps) => (
                <FormControl mt="16px" isInvalid={form.errors[name] && form.touched[name]}>
                    <FormLabel>{placeholder}</FormLabel>
                    {type === "select" ?
                        <Select {...field} placeholder={placeholder} >
                            {options?.map((item) => <option value={item} key={item}>{item}</option>)}
                        </Select >
                        : <Input {...field} type={type} placeholder={placeholder} />}

                    <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                </FormControl>
            )}
        </Field>)
}

export default FormField