import { useContext, useState } from 'react';
import moment from 'moment';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Text, Stack, Spinner, Flex, Select } from '@chakra-ui/react';
import { orderBy } from "lodash"

import { AppContext } from '../AppContext';
import ExpenseTable from './ExpenseTable';
import { getExpenseByDate, getExpenses } from '../api';

const Expenses = () => {

    const {
        expenses,
        totalExpenses,
        selectedMonthExpense,
        setExpenses,
        setTotalExpenses,
        setSelectedMonthExpense } = useContext(AppContext);

    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchExpences = async (from?: string, to?: string) => {
        try {
            setLoading(true)
            setExpenses([])
            const response = from ? await getExpenseByDate(from, to) : await getExpenses()

            const sortedData: any = orderBy(response.data.expenditures, ["date"], ["desc"])
            setExpenses(sortedData);

            setTotalExpenses(response.data.totalExpenditure)
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

        setSelectedMonthExpense(e.target.value);

        if (e.target.value === "all") {
            fetchExpences()
            return;
        }

        const startOfMonth = moment(e.target.value).add(1, "day").toDate();
        const endOfMonth = moment(e.target.value).endOf('month').toDate();
        startOfMonth.setUTCHours(0, 0, 0, 0);
        endOfMonth.setUTCHours(0, 0, 0, 0);

        fetchExpences(startOfMonth.toISOString(), endOfMonth.toISOString())
    }

    return (
        <Flex justifyContent="center" direction="column" w="100%">
            <Flex m={2} pl={2} pr={2} justifyContent="space-between">
                <Select
                    width="200px"
                    value={selectedMonthExpense}
                    placeholder='Select Filter'
                    onChange={handleDropdownChange}>
                    <>
                        <option value='all'>All Expenses</option>
                        {renderDropdown()}
                    </>
                </Select>

                <Button colorScheme='teal'
                    size='md'
                    w="30%"
                    onClick={() => navigate("/add-expence")}>
                    Add Expense
                </Button>
            </Flex>

            <Flex w="100%" direction="column" alignItems="center" h="94vh">

                {isLoading && <Spinner size='lg' mt="100px" />}

                {expenses.length > 0 && (<>
                    <Stack direction="row" m={4} w="100%" pl="12px" >
                        <Text fontSize="md" as="b">Total Expenses</Text>
                        <Text fontSize="md" as="b">   <span>&#8377;</span> {totalExpenses}</Text>
                    </Stack>
                    <ExpenseTable records={expenses} />
                </>
                )}
            </Flex>
        </Flex>)
}

export default Expenses