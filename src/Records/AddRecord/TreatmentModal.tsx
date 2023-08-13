import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    TableContainer,
    Checkbox,
    Flex,
    Box,
    Text
} from '@chakra-ui/react'
import { Formik, useFormikContext } from 'formik'
import { useState } from "react"
import { saveTreatment } from '../../api'
import moment from 'moment'

const standerdUnits: any = {
    Injection: "ml",
    "Deworming (Liquid)": "ml",
    "Deworming (Tablet)": "Tablet",
    Vaccination: "NA",
}

const TreatmentModal = ({ isOpen, onClose }: any) => {

    const recordForm = useFormikContext();
    const { treatment: treatmentType = "" }: any = recordForm?.values;
    let avlTreatments: any = localStorage.getItem('avlTreatments')
    avlTreatments = avlTreatments ? JSON.parse(avlTreatments) : [];
    const allStoredTreatments = [...avlTreatments];
    avlTreatments = avlTreatments.filter(({ type }: any) => type === treatmentType)
    const [newTreatment, setNewTreatment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const isDueDate = ['Vaccination', 'Deworming (Liquid)', 'Deworming (Tablet)'].includes(treatmentType);
    const noUnit = ['Vaccination'].includes(treatmentType);


    const getTypePrefix = (type = '') => {
        if (!type || ['General Checkup', 'Other'].includes(type)) return '';
        return `${type}:`
    }

    const getItemDisplay = (item: any) => {
        let display = `${getTypePrefix(item.type)}${item.name} ${item.value ? `${item.value} ${item.unit || ''}` : ""}`
        if (item.dueDate) display = `${display}#${moment(new Date(item.dueDate)).format("DD MMM yyyy")}`
        return display;
    }
    const handleSubmit = ({ avlTreatments }: any) => {
        const selectedItems = avlTreatments.filter((item: any) => item.checked).map((item: any) => ({ ...item, display: getItemDisplay(item) }));
        const { treatmentItems: prevItems = [] }: any = recordForm?.values
        const treatmentItems = [...prevItems, ...selectedItems]
        recordForm.setFieldValue("treatmentItems", treatmentItems)
        console.log(treatmentItems);
        onClose();
    }

    const addNewTreatment = async (setFieldValue: any, { avlTreatments = [] }: any) => {
        try {
            const newTreatmentObj: any = { name: newTreatment, type: treatmentType, unit: standerdUnits[treatmentType] || '' };
            const newAvlTreatments = [newTreatmentObj, ...allStoredTreatments]
            setLoading(true);

            await saveTreatment(newTreatmentObj);

            setFieldValue("avlTreatments", [newTreatmentObj, ...avlTreatments]);
            setNewTreatment('');
            localStorage.setItem('avlTreatments', JSON.stringify(newAvlTreatments))
        } catch (error) { console.log(error) }
        finally {
            setLoading(false)
        }
    }

    const renderTreatmentTable = ({ values, setFieldValue }: any) => {
        return (
            <>
                <Flex justify="space-between" align="flex-end" gap="20px" mb="16px">
                    <Input placeholder="Add New Treatment" value={newTreatment} onChange={(e) => setNewTreatment(e.target.value)} />
                    <Button disabled={!newTreatment} onClick={() => addNewTreatment(setFieldValue, values)} isLoading={loading}>+</Button>
                </Flex>
                <TableContainer>
                    <Table maxWidth="100%" overflowY={'hidden'}>
                        <Thead position="sticky" top={0} zIndex="docked">
                            <Tr >
                                <Th></Th>
                                <Th>Name</Th>
                                {!noUnit && <Th>Quantity</Th>}
                                {isDueDate && <Th>Due Date</Th>}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                values.avlTreatments.map((item: any, index: any) => (
                                    <Tr key={`${item.name}-${index}`}>
                                        <Td><Checkbox onChange={(e) => setFieldValue(`avlTreatments[${index}].checked`, e.target.checked)} /></Td>
                                        <Td><Text width="100px" isTruncated>{item.name}</Text></Td>
                                        {!noUnit && <Td> <Input disabled={!item.checked} placeholder={`0 ${standerdUnits[treatmentType] || ''}`} value={avlTreatments[index].value} onChange={(e) => setFieldValue(`avlTreatments[${index}].value`, e.target.value)} /> </Td>}
                                        {isDueDate && <Td> <Input type="date" disabled={!item.checked} value={avlTreatments[index].dueDate} onChange={(e) => setFieldValue(`avlTreatments[${index}].dueDate`, e.target.value)} /> </Td>}
                                    </Tr>
                                ))

                            }
                        </Tbody>

                    </Table>
                </TableContainer>
            </>
        )
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
                            <Box mt="20px" boxSizing="border-box" overflowY="auto">  {renderTreatmentTable(props)} </Box>
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