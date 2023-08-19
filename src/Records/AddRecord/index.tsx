
import { Button, Box, Divider, useDisclosure, HStack, Tag, TagLabel, Radio, TagCloseButton, FormLabel } from '@chakra-ui/react';
import { useContext } from 'react';
import { Form, Formik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';

import FormField from '../../utils/FormField';
import { saveRecords } from '../../api';
import { Flex } from '@chakra-ui/react';
import TreatmentModal from './TreatmentsModal/TreatmentModal';
import HistoryObservedModal from './HistoryObservedModal/HistoryObservedModal';
import { generatePrescription } from '../../utils/generate-prescription';
import { AppContext } from '../../AppContext';
import { updateRecord } from '../../api/index';

const AddRecord = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const isEditMode = pathname === '/edit';
    const { searchRecord = {} } = useContext(AppContext);

    const { isOpen: isTreatmentModalOpen, onOpen: onTreatmentModalOpen, onClose: onTreatModalClose } = useDisclosure()
    const { isOpen: isHistoryOpen, onOpen: onHistoryModalOpen, onClose: onHistoryModalClose } = useDisclosure()

    console.log(searchRecord)
    const initialValues = {
        ownerName: searchRecord.ownerName || "",
        petName: searchRecord.petName || "",
        address: searchRecord.address || "",
        species: searchRecord.species || "",
        breed: searchRecord.breed || "",
        color: searchRecord.color || "",
        weight: searchRecord.weight || "",
        age: searchRecord.age || "",
        gender: searchRecord.gender || "",
        mobileNumber: searchRecord.mobileNumber || "",
        paidAmount: isEditMode ? searchRecord.paidAmount : "",
        date: isEditMode ? searchRecord.date : "",
        fees: isEditMode ? searchRecord.fees : "",
        whatsapp: "No",
        remainingAmount: isEditMode ? searchRecord.remainingAmount : "",
        treatment: isEditMode ? searchRecord.treatment : "",
        treatmentDescription: isEditMode ? searchRecord.treatmentDescription : "",
        reference: isEditMode ? searchRecord.reference : "",
        treatmentItems: [],
        history: []
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
        treatment: Yup.string(),
        reference: Yup.string()
            .required('Required'),
        date: Yup.string().required("Required"),
        fees: Yup.number(),
        paidAmount: Yup.number()

    });

    const handleSubmit = async (values: any, actions: any) => {
        console.log(values)
        try {
            const body = { ...values }
            body.date = new Date(values.date).toISOString()
            body.fees = +values.fees
            body.paidAmount = +values.paidAmount
            body.remainingAmount = +values.remainingAmount
            body.mobileNumber = values.mobileNumber ? +values.mobileNumber : 0
            body.history = values.history.map(({ name }: any) => name).join(", ");
            if (values.treatmentItems.length)
                body.treatment = values.treatmentItems.map(({ display }: any) => display.trim()).join(",")

            delete body.treatmentItems
            delete body.whatsapp
            console.log(body)

            if (!isEditMode) {
                await saveRecords(body)
            } else {
                delete body.date
                delete body.followupDate
                delete body.treatment
                delete body.history
                delete body.treatmentDescription
                delete body.reference

                await updateRecord(searchRecord.id, searchRecord.date, body)
            }

            if (values.whatsapp === "Yes") {
                try {
                    const pdfUrl = await generatePrescription(body)
                    const url = `/view-pdf?pdfUrl=${pdfUrl}&mobile=${body.mobileNumber}&ownerName=${body.ownerName}&petName=${body.petName}`;
                    navigate(url)
                } catch (error: any) { alert(error.toString()) }
            } else { navigate("/") }

        } catch (error: any) {
            console.log(error)
            alert(error.toString())
        }

        actions.setSubmitting(false)
    }

    const renderChips = (items: any, setFieldValue: any, fieldName: string) =>
    (
        <HStack wrap="wrap" gap={2} justify="left" mt="12px">
            {items.map((item: any, index: any) => (
                <Tag
                    size="md"
                    key={`${item.name}-${index}`}
                    borderRadius='full'
                    variant='solid'
                    colorScheme="teal"
                >
                    <TagLabel>{`${item.display || item.name}`}</TagLabel>
                    <TagCloseButton onClick={() => setFieldValue(fieldName, items.filter(({ name }: any) => name !== item.name))} />
                </Tag>
            ))}
        </HStack>
    )

    const renderRadio = (options: any, fieldName: string, setFieldValue: any, value: any) => (
        <HStack spacing="26px">
            {options.map((option: any) => <Radio key={option} value={option} isChecked={value === option} onChange={(e) => setFieldValue(fieldName, e.target.value)}>{option}</Radio>)}
        </HStack>
    )

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
                        {!isEditMode && <FormField name="date" placeholder="Date" type="date" />}
                        <FormField name="mobileNumber" placeholder="Mobile Number" type="number" />
                        <FormField name="ownerName" placeholder="Owner Name" />
                        <FormField name="address" placeholder="Address" />
                    </Box>
                    <Divider orientation='horizontal' mt={4} />

                    <Box pl={4} pr={4}>
                        <FormField name="petName" placeholder="Pet Name" />
                        <Flex justify="space-between" align="flex-end" gap="20px" mt="16px">
                            <FormLabel>Gender</FormLabel>
                            {renderRadio(['Male', 'Female'], 'gender', props.setFieldValue, props.values.gender)}
                        </Flex>
                        <FormField
                            name="species"
                            placeholder="Species"
                            type="select"
                            options={["Dog", "Cat", "Rabbit", "Bird", "Turtle", "Other"]} />
                        <FormField name="breed" placeholder="Breed" />
                        <FormField name="color" placeholder="Color" />
                        <FormField name="weight" placeholder="Weight (KG)" />
                        <FormField name="age" placeholder="Age" />
                        {!isEditMode && <>
                            <Flex justify="space-between" align="flex-end" gap="20px" mt="16px">
                                <FormLabel>History Observed</FormLabel>
                                <Button onClick={onHistoryModalOpen}>+</Button>
                            </Flex>
                            {renderChips(props.values.history, props.setFieldValue, 'history')}

                            <Flex justify="space-between" align="flex-end" gap="20px">
                                <FormField
                                    name="treatment"
                                    placeholder="Treatment"
                                    type="select"
                                    options={["Vaccination", "General Checkup", "Injection", "Tablets", "Deworming (Tablet)", "Deworming (Liquid)", "Other"]} />

                                <Button onClick={onTreatmentModalOpen} disabled={!props.values.treatment}>+</Button>
                            </Flex>

                            {renderChips(props.values.treatmentItems, props.setFieldValue, 'treatmentItems')}
                            <FormField name="treatmentDescription" placeholder="Description" />
                        </>}
                    </Box>

                    <Divider mt={4} />

                    <Box pl={4} pr={4}>
                        <FormField name="fees" placeholder="Fees" type="number" />
                        <FormField name="paidAmount" placeholder="Paid Amount" type="number" />
                        <FormField name="remainingAmount" placeholder="Remaining Amount" type="number" />
                        <Divider />

                        {!isEditMode && <FormField name="reference" placeholder="Reference" type="select" options={["Self", "MaxSophie"]} />}

                        {!isEditMode && <FormField name="followupDate" placeholder="Followup Date" type="date" />}

                        {!isEditMode && <Flex justify="space-between" align="center" gap="20px" mt="20px">
                            <FormLabel>Digital Prescription</FormLabel>
                            {renderRadio(['Yes', 'No'], 'whatsapp', props.setFieldValue, props.values.whatsapp)}
                        </Flex>
                        }
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
                        {isEditMode ? 'Update' : ' Submit'}
                    </Button>

                    <TreatmentModal isOpen={isTreatmentModalOpen} onClose={onTreatModalClose} />
                    <HistoryObservedModal isOpen={isHistoryOpen} onClose={onHistoryModalClose} />
                </Form >
            )}


        </Formik >

    )
}

export default AddRecord