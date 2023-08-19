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
    Checkbox
} from '@chakra-ui/react'
import { Formik, useFormikContext } from 'formik'
import { Box } from '@chakra-ui/react';
import { useState } from "react";
import { Flex } from '@chakra-ui/react';
import { HistoryObservedTable } from './HistoryObservedTable';

const HistoryObservedModal = ({ isOpen, onClose }: any) => {

    const recordForm = useFormikContext();

    let avlHistory: any = localStorage.getItem('avlHistory')
    avlHistory = avlHistory ? JSON.parse(avlHistory) : [];
    const [history, setHistory] = useState<string>('');

    const handleSubmit = ({ avlHistory }: any) => {
        const updateHistory = avlHistory.map(({ name }: any) => ({ name }))
        localStorage.setItem('avlHistory', JSON.stringify(updateHistory))

        const selectedItems = avlHistory.filter((item: any) => item.checked);
        const { history = [] }: any = recordForm?.values
        const historyItems = [...history, ...selectedItems]
        recordForm.setFieldValue("history", historyItems)

        onClose();
    }


    const addNewHistory = (setFieldValue: any, values: any, history: string) => {
        setFieldValue("avlHistory", [{ name: history }, ...values.avlHistory])
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <Formik initialValues={{ avlHistory }} onSubmit={handleSubmit}>
                {props => <>
                    <ModalContent>
                        <ModalHeader>History Observed</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box boxSizing="border-box" overflowY="auto">
                                <HistoryObservedTable
                                    addNewHistory={addNewHistory}
                                />
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

export default HistoryObservedModal