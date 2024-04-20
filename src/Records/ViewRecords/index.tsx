import { Box, Flex, Text, Spinner } from "@chakra-ui/react"
import { Button } from '@chakra-ui/react';
import moment from 'moment'
import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { deleteRecord, getRecordsById } from "../../api";
import { AppContext } from '../../AppContext';
import { generateCard } from '../../utils/generate-card';
import { generatePrescription } from '../../utils/generate-prescription';
import { askRatingsOnWhatsApp } from "../../utils/send-message";

type IRecord = {
    id: string,
    date: string,
    fees: number,
    address: string,
    ownerName: string,
    mobileNumber: string,
    petName: string,
    gender: string,
    petNameType: string,
    species: string,
    weight: string,
    age: string,
    breed: string
    history: string,
    treatment: string,
    treatmentDescription: string,
    paidAmount: number,
    remainingAmount: number,
    digitalPrescription: string,
    digitalCard: string,
    followupFor: string,
    followupDate: string
}


type IParam = {
    id: string
}
const ViewRecords = () => {

    const { id } = useParams<IParam>()
    const [record, setRecord] = useState<IRecord | null>()
    const [loading, setLoading] = useState(false);
    const [loadingCard, setLoadingCard] = useState(false);
    const [loadingRatings, setLoadingRatings] = useState(false);
    const [loadingPrescription, setLoadingPrescription] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { getRecordById, setSearchRecord } = useContext(AppContext)

    const navigate = useNavigate()

    useEffect(() => {
        setRecord(getRecordById(id));
    }, [id])

    const handleAskRatings = async () => {

        try {
            setLoadingRatings(true)
            await askRatingsOnWhatsApp(record?.ownerName, record?.mobileNumber);
            alert("success");
        } catch (error) { alert(error) }
        finally {
            setLoadingRatings(false)
        }
    }


    const handleViewCard = async () => {
        try {
            let pdfUrl: any = ''

            if (record?.digitalCard === "Yes") {
                const fileDate = moment(new Date(record.date)).format("DD-MMM-yyyy")
                pdfUrl = `https://pet-clinic-pdfs.s3.amazonaws.com/${record.petName}-card-${fileDate}.pdf`
            } else {
                setLoadingCard(true)
                pdfUrl = await generateCard(record)
            }

            const url = `/view-pdf?pdfUrl=${pdfUrl}&mobile=${record?.mobileNumber}&ownerName=${record?.ownerName}&petName=${record?.petName}&type=Vaccination Card&followupFor=${record?.followupFor}&followupDate=${record?.followupDate}`;
            navigate(url)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoadingCard(false)
        }
    }

    const handlePrescription = async () => {
        try {
            let pdfUrl: any = ''
            if (record?.digitalPrescription === "Yes") {
                const fileDate = moment(new Date(record.date)).format("DD-MMM-yyyy")
                pdfUrl = `https://pet-clinic-pdfs.s3.amazonaws.com/${record.petName}-prescription-${fileDate}.pdf`
            } else {
                setLoadingPrescription(true)
                pdfUrl = await generatePrescription(record)
            }
            const url = `/view-pdf?pdfUrl=${pdfUrl}&mobile=${record?.mobileNumber}&ownerName=${record?.ownerName}&petName=${record?.petName}&followupFor=${record?.followupFor}&followupDate=${record?.followupDate}`;
            navigate(url)
        } catch (error: any) { alert(error.toString()) }
        finally {
            setLoadingPrescription(false)
        }
    }

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

    const handlUpdate = () => {
        setSearchRecord(record);
        navigate('/edit');
    }

    const handleAddNew = () => {
        setSearchRecord(record);
        navigate('/addrecord');
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
                    {renderRecord("Gender", record.gender, true)}
                    {renderRecord("breed", record.breed, false)}
                    {renderRecord("Weight", record.weight, true)}
                    {renderRecord("Age", record.age, false)}
                    {renderRecord("history", record.history, true)}
                    {renderRecord("Treatment", record.treatment, false)}
                    {renderRecord("Followup Date", record.followupDate && record.followupDate !== '-' ? moment(record.followupDate).format('DD MMM yyyy') : '-', true)}
                    {renderRecord("Followup For", record.followupFor ? record.followupFor : '-', false)}
                    {renderRecord("Description", record.treatmentDescription, true)}
                    {renderRecord("Fees", (<><span>&#8377;</span> {record.fees}</>), false)}
                    {renderRecord("Paid Amount", (<><span>&#8377;</span>{` ${record.paidAmount}`}</>), true)}
                    {renderRecord("Remaining Amount", (<><span>&#8377;</span>{record.remainingAmount || 0}</>), false)}

                    <Flex justify="space-evenly" mt="20px" flexWrap="wrap" gap={5}>

                        <Button colorScheme='teal'
                            size='md'
                            w="30%"
                            onClick={handleAddNew}>
                            Add New
                        </Button>

                        <Button colorScheme='teal'
                            size='md'
                            w="30%"
                            isLoading={loadingPrescription}
                            onClick={handlePrescription}>
                            Prescription
                        </Button>


                        <Button colorScheme='teal'
                            size='md'
                            w="30%"
                            isLoading={loadingCard}
                            onClick={handleViewCard}>
                            View Card
                        </Button>

                        <Button colorScheme='teal'
                            size='md'
                            w="30%"
                            isLoading={loadingRatings}
                            onClick={handleAskRatings}>
                            Ask Ratings
                        </Button>

                        <Button colorScheme='teal'
                            size='md'
                            w="30%"
                            onClick={handlUpdate}>
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