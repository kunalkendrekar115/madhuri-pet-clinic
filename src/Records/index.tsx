import { useContext, useState } from 'react';
import moment from 'moment';
import { AppContext } from '../AppContext';
import { Text, Stack, Spinner, Flex, Select } from '@chakra-ui/react';
import { orderBy } from "lodash"

import RecordsTable from './RecordsTable';
import { getRecords, getRecordsByDate } from '../api';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Records = () => {

    const {
        records,
        totalEarnings,
        selectedMonth,
        setRecords,
        setTotalEarnings,
        setSelectedMonth } = useContext(AppContext);

    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchRecords = async (from?: string, to?: string) => {
        try {
            setLoading(true)
            setRecords([])
            const response = from ? await getRecordsByDate(from, to) : await getRecords()

            const sortedData: any = orderBy(response.data.records, ["date"], ["desc"])
            setRecords(sortedData);

            setTotalEarnings(response.data.totalEarnings)
        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }


    const renderDropdown = () => {

        var startDate = moment('2022-09-01');
        var endDate = moment(new Date());

        var dates = [];

        var month = moment(endDate); //clone the startDate
        while (month > startDate) {
            dates.push(month.format('MMMM-yyyy'));
            month.subtract(1, "month");
        }

        return (dates.map((v, i) => <option key={i} value={v}>{v}</option>));
    }

    const handleDropdownChange = (e: any) => {

        setSelectedMonth(e.target.value);

        if (e.target.value === "all") {
            fetchRecords()
            return;
        }

        const startOfMonth = moment(e.target.value).add(1, "day").toDate();
        const endOfMonth = moment(e.target.value).endOf('month').toDate();
        startOfMonth.setUTCHours(0, 0, 0, 0);
        endOfMonth.setUTCHours(0, 0, 0, 0);

        fetchRecords(startOfMonth.toISOString(), endOfMonth.toISOString())
    }

    return (
        <Flex justifyContent="center" direction="column" w="100%">
            <Flex m={2} pl={2} pr={2} justifyContent="space-between">
                <Select
                    width="200px"
                    value={selectedMonth}
                    placeholder='Select Filter'
                    onChange={handleDropdownChange}>
                    <>
                        <option value='all'>All Records</option>
                        {renderDropdown()}
                    </>
                </Select>

                <Button colorScheme='teal'
                    size='md'
                    w="30%"
                    onClick={() => navigate("/addrecord")}>
                    Add Record
                </Button>
            </Flex>

            <Flex w="100%" direction="column" alignItems="center" h="94vh">

                {isLoading && <Spinner size='lg' mt="100px" />}

                {records.length > 0 && (<>
                    <Stack direction="row" spacing={2} m={2} w="100%" pl="12px" >
                        <Text fontSize="md" as="b">Total Earnings</Text>
                        <Text fontSize="md" as="b">   <span>&#8377;</span> {totalEarnings}</Text>
                    </Stack>
                    <RecordsTable records={records} /></>
                )}
            </Flex>
        </Flex>)
}

export default Records