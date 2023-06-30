import { ChevronRightIcon } from '@chakra-ui/icons'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    Text,
    Flex,
} from '@chakra-ui/react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom';


interface IExpense {
    date: string,
    amount: number,
    type: string,
    summary: string
}

type ExpenseTableProps = {
    records: IExpense[]
}

const ExpenseTable = ({ records }: ExpenseTableProps) => {

    const navigate = useNavigate()

    return (
        <TableContainer flex={1} h={0} overflowY="auto" w="100%">
            <Table variant='striped'>
                <Thead position="sticky" top={0} zIndex="docked" bg="blue.100">
                    <Tr h="50px">
                        <Th>Date</Th>
                        <Th>Type</Th>
                        <Th>Amount</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {records &&
                        records.map((item: IExpense) => (
                            <Tr h="50px">
                                <Td>{moment(new Date(item.date)).format("DD MMM")}</Td>
                                <Td maxWidth="85vw"> <Text isTruncated>{item.type !== "Other" ? item.type : item.summary}</Text> </Td>
                                <Td>
                                    <Flex justify="space-between" alignItems="center">
                                        <Text><span>&#8377;</span> {item.amount}</Text>
                                        <ChevronRightIcon boxSize={4} ml="12px" />
                                    </Flex>
                                </Td>
                            </Tr>
                        ))

                    }
                </Tbody>

            </Table>
        </TableContainer>
    )
}

export default ExpenseTable