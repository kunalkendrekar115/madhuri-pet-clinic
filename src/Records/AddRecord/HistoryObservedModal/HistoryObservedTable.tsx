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

export const HistoryObservedTable = ({ addNewHistory }: any) => {

    const [inputValue, setInputValue] = useState<string>('');
    const { values, setFieldValue }: any = useFormikContext();
    const [historyItems, setHistoryItems] = useState([])


    useEffect(() => {
        if (inputValue) {
            const filterItems = values.avlHistory.filter((item: any) => item.name.toUpperCase().includes(inputValue.toUpperCase()))
            console.log(filterItems)
            setHistoryItems(filterItems)
        } else setHistoryItems(values.avlHistory);
    }, [values.avlHistory, inputValue])

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
                <Button disabled={!inputValue && historyItems.length > 0} onClick={() => addNewHistory(setFieldValue, values, inputValue)}  > +</Button >
            </Flex >
            <TableContainer height="50vh" overflowY="auto">
                <Table>
                    <Thead position="sticky" top={0} zIndex="docked">
                        <Tr >
                            <Th></Th>
                            <Th>Select History Observed</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {historyItems.map((item: any, index: any) => (
                            <Tr key={`${item.name}-${index}`}>
                                <Td width="3%"><Checkbox onChange={(e) => setFieldValue(`avlHistory[${index}].checked`, e.target.checked)} /></Td>
                                <Td>{item.name}</Td>
                            </Tr>
                        ))

                        }
                    </Tbody>

                </Table>
            </TableContainer>
        </>
    )
}
