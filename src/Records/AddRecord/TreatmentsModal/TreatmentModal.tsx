import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box,
} from '@chakra-ui/react'
import { Formik, useFormikContext } from 'formik'
import { useState } from "react"
import { saveTreatment } from '../../../api'
import moment from 'moment'
import { TreatmentsTable } from './TreatmentsTable'

const standerdUnits: any = {
    Injection: "ml",
    "Deworming (Tablet)": "Tablet",
    "Tablets": "Tablet",
    Vaccination: "NA",
}

const TreatmentModal = ({ isOpen, onClose }: any) => {

    const recordForm = useFormikContext();
    const { treatment: treatmentType = "" }: any = recordForm?.values;
    let avlTreatments: any = localStorage.getItem('avlTreatments')
    avlTreatments = avlTreatments ? JSON.parse(avlTreatments) : [];
    const allStoredTreatments = [...avlTreatments];
    avlTreatments = avlTreatments.filter(({ type }: any) => type === treatmentType)
    const [loading, setLoading] = useState<boolean>(false);

    const isDueDate = ['Vaccination', 'Deworming (Liquid)', 'Deworming (Tablet)'].includes(treatmentType);
    const noUnit = ['Vaccination'].includes(treatmentType);

    const qtyDisplay = `Quantity${standerdUnits[treatmentType] ? ` (${standerdUnits[treatmentType]})` : ''}`;

    const getTypePrefix = (type = '') => {
        if (!type || ['General Checkup', 'Other'].includes(type)) return '';
        return `${type}:`
    }

    const getItemDisplay = (item: any) => {

        let unit = standerdUnits[treatmentType] || ''

        if (unit && ['Deworming (Tablet)', 'Tablets'].includes(treatmentType) && !isNaN(item.value) && +item.value > 1) unit = `${unit}s`

        let display = `${getTypePrefix(item.type)}${item.name} ${item.value ? `${item.value} ${unit}` : ""}`
        if (item.dueDate) display = `${display}#${moment(new Date(item.dueDate)).format("DD MMM yyyy")}`

        return display;
    }
    const handleSubmit = ({ avlTreatments }: any) => {
        const selectedItems = avlTreatments.filter((item: any) => item.checked).map((item: any) => ({ ...item, display: getItemDisplay(item) }));
        const { treatmentItems: prevItems = [] }: any = recordForm?.values
        const treatmentItems = [...prevItems, ...selectedItems]
        recordForm.setFieldValue("treatmentItems", treatmentItems)
        console.log(treatmentItems);

        const followupDates = treatmentItems.filter(({ dueDate }: any) => dueDate).sort((a: any, b: any) => {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })

        if (followupDates?.length) {
            recordForm.setFieldValue('followupDate', followupDates[0].dueDate)
            recordForm.setFieldValue('followupFor', `${followupDates[0].type}`)
        }

        onClose();
    }

    const addNewTreatment = async (setFieldValue: any, { avlTreatments = [] }: any, treatmentName: string) => {
        try {
            const newTreatmentObj: any = { name: treatmentName, type: treatmentType, unit: standerdUnits[treatmentType] || '' };
            const newAvlTreatments = [newTreatmentObj, ...allStoredTreatments]
            setLoading(true);

            await saveTreatment(newTreatmentObj);

            setFieldValue("avlTreatments", [newTreatmentObj, ...avlTreatments]);
            localStorage.setItem('avlTreatments', JSON.stringify(newAvlTreatments))
        } catch (error) { console.log(error) }
        finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <Formik initialValues={{ avlTreatments }} onSubmit={handleSubmit}>
                {props => <>
                    <ModalContent>
                        <ModalHeader>{treatmentType}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box mt="20px" boxSizing="border-box" overflowY="auto">
                                <TreatmentsTable
                                    addNewTreatment={addNewTreatment}
                                    noUnit={noUnit}
                                    qtyDisplay={qtyDisplay}
                                    isDueDate={isDueDate}
                                    loading={loading}
                                    avlTreatments={avlTreatments} />
                            </Box>
                        </ModalBody>

                        <ModalFooter>
                            <Button disabled={!props.dirty} colorScheme='blue' mr={3} onClick={props.submitForm}>
                                Submit
                            </Button>
                            <Button variant='ghost' onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </>
                }
            </Formik>
        </Modal>

    )

}

export default TreatmentModal