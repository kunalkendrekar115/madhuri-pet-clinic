
import { Button, Box, Divider } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { saveExpense } from '../../api';
import FormField from '../../utils/FormField';


const AddExpence = () => {

    const navigate = useNavigate()

    const initialValues = {
        date: "",
        summary: "",
        amount: "",
        type: "",
    }

    const addExpenceSchema = Yup.object().shape({
        type: Yup.string()
            .required('Required'),
        summary: Yup.string()
            .required('Required'),
        date: Yup.string().required("Required"),
        amount: Yup.number().required("Required")

    });

    const handleSubmit = async (values: any, actions: any) => {
        try {
            const body = { ...values }
            body.date = new Date(values.date).toISOString()
            body.amount = +values.amount

            console.log(body)

            await saveExpense(body)

            navigate("/")

        } catch (error: any) {
            console.log(error)
            alert(error.toString())
        }

        actions.setSubmitting(false)
    }
    return (

        <Formik
            initialValues={initialValues}
            validationSchema={addExpenceSchema}
            onSubmit={(values, actions) => {
                console.log(values);
                handleSubmit(values, actions)
            }}
        >
            {(props) => (
                <Form>
                    <Box pl={4} pr={4}>
                        <FormField name="date" placeholder="Date" type="date" />
                    </Box>
                    <Divider orientation='horizontal' mt={4} />

                    <Box pl={4} pr={4}>
                        <FormField
                            name="type"
                            placeholder="Type"
                            type="select"
                            options={["Medicines Order", "Max_Sophie Share", "Blood Test", "Other"]} />
                        <FormField name="summary" placeholder="Summary" />
                    </Box>

                    <Divider mt={4} />

                    <Box pl={4} pr={4}>
                        <FormField name="amount" placeholder="Amount" type="number" />
                    </Box>
                    <Button
                        mt={8}
                        mb={8}
                        ml="5%"
                        w="90%"
                        colorScheme='teal'
                        isLoading={props.isSubmitting}
                        type='submit'
                    >
                        Submit
                    </Button>
                </Form >
            )}
        </Formik >

    )
}

export default AddExpence