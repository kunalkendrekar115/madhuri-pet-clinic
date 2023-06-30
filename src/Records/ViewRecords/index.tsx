import { Box, Flex, Text, Spinner } from "@chakra-ui/react"
import { Button } from '@chakra-ui/react';
import moment from 'moment'
import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { deleteRecord, getRecordsById } from "../../api";
import { AppContext } from '../../AppContext';

type IRecord = {
    id: string,
    date: string,
    fees: number,
    address: string,
    ownerName: string,
    mobileNumber: string,
    petName: string,
    petNameType: string,
    species: string,
    breed: string
    history: string,
    treatment: string,
    treatmentDescription: string,
    paidAmount: number,
    remainingAmount: number
}


type IParam = {
    id: string
}
const ViewRecords = () => {

    const { id } = useParams<IParam>()
    const [record, setRecord] = useState<IRecord | null>()
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { getRecordById } = useContext(AppContext)

    const navigate = useNavigate()

    useEffect(() => {
        setRecord(getRecordById(id));
    }, [id])

    const handleDeleteRecord = async () => {
        if (!record) return;

        try {
            setDeleteLoading(true)
            await deleteRecord(record.id, record.date);
            navigate('/')

        } catch (error) {
            console.log(error)
        }
        setDeleteLoading(false)
    }


    const renderRecord = (key: string, value: any, isEven: boolean) => (
        <Flex justify="space-between" w="100%" bg={isEven ? "blue.50" : "white"} alignItems="center" paddingY="12px" paddingX="16px">
            <Text fontWeight={500} mr="4px">{`${key}:`}</Text>
            <Text fontWeight={500} ml="4px" align="right">{value || "-"}</Text>
        </Flex>)

    return (<Flex justifyContent="center" mt="12px">
        {loading && <Spinner size='lg' mt="100px" />}

        {record &&
            (<>
                <Box w="100%" pb="20px">
                    {renderRecord("Date", moment(new Date(record.date)).format("DD MMM yyyy"), true)}
                    {renderRecord("Owner Name", record.ownerName, false)}
                    {renderRecord("Mobile Number", record.mobileNumber, true)}
                    {renderRecord("Address", record.address, false)}
                    {renderRecord("Pet Name", record.petName || record.petNameType, true)}
                    {renderRecord("Species", record.species, false)}
                    {renderRecord("breed", record.breed, true)}
                    {renderRecord("history", record.history, false)}
                    {renderRecord("Treatment", record.treatment, true)}
                    {renderRecord("Description", record.treatmentDescription, false)}
                    {renderRecord("Fees", (<><span>&#8377;</span> {record.fees}</>), true)}
                    {renderRecord("Paid Amount", (<><span>&#8377;</span>{` ${record.paidAmount}`}</>), false)}
                    {renderRecord("Remaining Amount", (<><span>&#8377;</span>{record.remainingAmount || 0}</>), true)}

                    <Flex justify="space-evenly" mt="20px">
                        <Button colorScheme='teal'
                            size='md'
                            w="30%"
                            onClick={() => { }}>
                            Edit
                        </Button>

                        <Button colorScheme='teal'
                            size='md'
                            w="30%"
                            isLoading={deleteLoading}
                            onClick={handleDeleteRecord}>
                            Delete
                        </Button>
                    </Flex>
                </Box>


            </>)}
    </Flex>)
}

export default ViewRecords