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


interface IRecord {
    date: string,
    fees: number,
    id: string,
    ownerName: string
}

type RecordsTableProps = {
    records: IRecord[]
}

const RecordsTable = ({ records }: RecordsTableProps) => {

    const navigate = useNavigate()

    return (
        <TableContainer flex={1} h={0} overflowY="auto">
            <Table variant='striped'>
                <Thead position="sticky" top={0} zIndex="docked" bg="blue.100">
                    <Tr h="50px">
                        <Th>Date</Th>
                        <Th>Owner Name</Th>
                        <Th>Fees</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {records &&
                        records.map((item: IRecord) => (
                            <Tr h="50px" onClick={() => navigate(`/view/${item.id}`)}>
                                <Td>{moment(new Date(item.date)).format("DD MMM yyyy")}</Td>
                                <Td maxWidth="35vw"> <Text isTruncated>{item.ownerName}</Text> </Td>
                                <Td>
                                    <Flex justify="space-between" alignItems="center">
                                        <Text><span>&#8377;</span> {item.fees}</Text>
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

export default RecordsTable