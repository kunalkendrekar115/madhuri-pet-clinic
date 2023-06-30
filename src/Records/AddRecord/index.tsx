
import { Button, Box, Divider } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import FormField from '../../utils/FormField';
import { saveRecords } from '../../api';

const AddRecord = () => {

    const navigate = useNavigate()

    const initialValues = {
        ownerName: "",
        petName: "",
        address: "",
        species: "",
        breed: "",
        history: "",
        paidAmount: "",
        mobileNumber: "",
        date: "",
        fees: "",
        remainingAmount: 0,
        treatment: "",
        treatmentDescription: "",
        reference: ""
    }

    const addRecordSchema = Yup.object().shape({
        ownerName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        petName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        species: Yup.string()
            .required('Required'),
        address: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        treatment: Yup.string()
            .required('Required'),
        reference: Yup.string()
            .required('Required'),
        date: Yup.string().required("Required"),
        fees: Yup.number().required("Required"),
        paidAmount: Yup.number().required("Required")

    });

    const handleSubmit = async (values: any, actions: any) => {
        try {
            const body = { ...values }
            body.date = new Date(values.date).toISOString()
            body.fees = +values.fees
            body.paidAmount = +values.paidAmount
            body.remainingAmount = +values.remainingAmount
            body.mobileNumber = values.mobileNumner ? +values.mobileNumber : 0

            console.log(body)

            await saveRecords(body)

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
            validationSchema={addRecordSchema}
            onSubmit={(values, actions) => {
                handleSubmit(values, actions)
            }}
        >
            {(props) => (
                <Form>
                    <Box pl={4} pr={4}>
                        <FormField name="date" placeholder="Date" type="date" />
                        <FormField name="mobileNumber" placeholder="Mobile Number" type="number" />
                        <FormField name="ownerName" placeholder="Owner Name" />
                        <FormField name="address" placeholder="Address" />
                    </Box>
                    <Divider orientation='horizontal' mt={4} />

                    <Box pl={4} pr={4}>
                        <FormField name="petName" placeholder="Pet Name" />
                        <FormField
                            name="species"
                            placeholder="Species"
                            type="select"
                            options={["Dog", "Cat", "Rabbit", "Turtle", "Other"]} />
                        <FormField name="breed" placeholder="Breed" />
                        <FormField name="history" placeholder="History" />
                        <FormField
                            name="treatment"
                            placeholder="Treatment"
                            type="select"
                            options={["Vaccination", "General Checkup", "Deworming", "Other"]} />
                        <FormField name="treatmentDescription" placeholder="Description" />
                    </Box>

                    <Divider mt={4} />

                    <Box pl={4} pr={4}>
                        <FormField name="fees" placeholder="Fees" type="number" />
                        <FormField name="paidAmount" placeholder="Paid Amount" type="number" />
                        <FormField name="remainingAmount" placeholder="Remaining Amount" type="number" />
                        <Divider />

                        <FormField name="reference" placeholder="Reference" type="select" options={["Self", "MaxSophie"]} />

                        <FormField name="followupDate" placeholder="Followup Date" type="date" />
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

export default AddRecord