import {
    Button,
    InputGroup,
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
    InputRightElement,
    Text
} from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import { useState, useEffect } from "react"
import { CloseIcon } from '@chakra-ui/icons';

export const TreatmentsTable = ({ addNewTreatment, noUnit, qtyDisplay, isDueDate, loading, avlTreatments }: any) => {

    const [inputValue, setInputValue] = useState<string>('');
    const { values, setFieldValue }: any = useFormikContext();
    const [treatmentItems, setTreatmentItems] = useState([])

    useEffect(() => {
        if (inputValue) {
            const filterItems = values.avlTreatments.filter((item: any) => item.name.toUpperCase().includes(inputValue.toUpperCase()))
            setTreatmentItems(filterItems)
        } else setTreatmentItems(values.avlTreatments);
    }, [values.avlTreatments, inputValue])

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    }
    const handleClearInput = () => {
        setInputValue('')
    }

    return (
        <>
            <Flex justify="space-between" align="flex-end" gap="20px" mb="16px">
                <InputGroup>
                    <Input placeholder="Search/ Add Treatment" value={inputValue} onChange={(e) => handleInputChange(e)} />
                    {inputValue &&
                        <InputRightElement>
                            <CloseIcon onClick={handleClearInput} />
                        </InputRightElement>}
                </InputGroup>
                <Button disabled={!inputValue && treatmentItems.length > 0} onClick={() => addNewTreatment(setFieldValue, values, inputValue)} isLoading={loading} > +</Button >
            </Flex >
            <TableContainer height="50vh" overflowY="auto">
                <Table maxWidth="100%">
                    <Thead position="sticky" top={0} zIndex="docked" backgroundColor="aliceblue">
                        <Tr >
                            <Th></Th>
                            <Th>Name</Th>
                            {!noUnit && <Th>{qtyDisplay}</Th>}
                            {isDueDate && <Th>Due Date</Th>}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            treatmentItems.map((item: any, index: any) => (
                                <Tr key={`${item.name}-${index}`}>
                                    <Td><Checkbox onChange={(e) => setFieldValue(`avlTreatments[${index}].checked`, e.target.checked)} /></Td>
                                    <Td><Text width="100px" isTruncated>{item.name}</Text></Td>
                                    {!noUnit && <Td> <Input disabled={!item.checked} placeholder="0" value={avlTreatments[index].value} onChange={(e) => setFieldValue(`avlTreatments[${index}].value`, e.target.value)} /> </Td>}
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
