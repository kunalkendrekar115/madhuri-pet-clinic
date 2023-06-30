import { Button, Stack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';

const Menu = () => {

    const navigate = useNavigate()

    const {
        setRecords,
        setTotalEarnings,
        setSelectedMonth,
        setExpenses,
        setTotalExpenses,
        setSelectedMonthExpense
    } = useContext(AppContext);

    useEffect(() => {
        setRecords([]);
        setExpenses([]);
        setSelectedMonth(null);
        setSelectedMonthExpense(null)
        setTotalEarnings(null)
        setTotalEarnings(null);
        setTotalExpenses(null);
    }, [])

    return (<Stack spacing={16} direction='column' align='center' mt="20px">

        <Button colorScheme='teal' size='md' w="80%" mt="40px" onClick={() => navigate("records")}>
            Manage Records
        </Button>
        <Button colorScheme='teal' size='md' w="80%" onClick={() => navigate("expenses")}>
            Manage Expense
        </Button>
    </Stack>)
}

export default Menu