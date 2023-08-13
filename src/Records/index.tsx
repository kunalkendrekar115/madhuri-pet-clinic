import { useContext, useState, useRef } from 'react';
import { debounce } from "lodash";
import moment from 'moment';

import { AppContext } from '../AppContext';
import { Text, Stack, Spinner, Flex, Select, Input, InputRightElement, InputGroup } from '@chakra-ui/react';
import { orderBy } from "lodash"

import RecordsTable from './RecordsTable';
import { getRecords, getRecordsByDate, getRecordsBysearchQuery } from '../api';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CloseIcon } from '@chakra-ui/icons';

const Records = () => {

    const {
        records,
        totalEarnings,
        selectedMonth,
        setRecords,
        setTotalEarnings,
        setSelectedMonth,
        setSearchRecord,
        searchQuery,
        setSearchQuery
    } = useContext(AppContext);

    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()

    const debounceSearch = useRef(debounce((search) => {
        setSelectedMonth('');
        fetchRecords('', '', search)
    }, 1000)).current

    const fetchRecords = async (from?: string, to?: string, searchQuery?: string) => {
        try {
            setLoading(true)
            setRecords([])
            let response = null

            if (searchQuery) {
                response = await getRecordsBysearchQuery(searchQuery);
            }
            else if (from) { response = await getRecordsByDate(from, to) }
            else { response = await getRecords() }

            const sortedData: any = orderBy(response.data.records, ["date"], ["desc"])
            setRecords(sortedData);

            if (sortedData.length && searchQuery)
                setSearchRecord(sortedData[0])

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

        handleClearSearch();

        fetchRecords(startOfMonth.toISOString(), endOfMonth.toISOString())
    }

    const handleSearchChangeChange = ({ target: { value: search } }: any) => {
        setSearchQuery(search);

        debounceSearch(search);
    }

    const handleClearSearch = () => {
        setSearchQuery('')
        setRecords('')
        setSearchRecord('')
    }
    return (
        <Flex justifyContent="center" direction="column" w="100%">
            <Flex m={2} pl={2} pr={2} gap={2} direction="column" align="center">
                <InputGroup>
                    <Input type="text" value={searchQuery} onChange={handleSearchChangeChange} placeholder='Search by Name / Phone Number' />
                    {searchQuery && <InputRightElement>
                        <CloseIcon onClick={handleClearSearch} />
                    </InputRightElement>}
                </InputGroup>
                <Text>or</Text>
                <Flex justify="space-between" w="100%">
                    <Select
                        width="200px"
                        value={selectedMonth}
                        placeholder='Select Month Filter'
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