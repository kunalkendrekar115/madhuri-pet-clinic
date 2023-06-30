import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, ChakraProvider, Flex, Text } from '@chakra-ui/react'
import { useLocation } from "react-router-dom"
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

import { getCookie } from './utils/cookies'
import { AppContext } from './AppContext';

import "./App.css";

function App() {

  const [records, setRecords] = useState([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState<any>()

  const [expenses, setExpenses] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [selectedMonthExpense, setSelectedMonthExpense] = useState<any>()

  const location = useLocation()
  const navigate = useNavigate();

  useEffect(() => {
    if (!getCookie() && location.pathname !== "/login") {
      navigate("login")
    }
  })

  const isHome = ["/", "/login"].includes(location.pathname)
  const titleStyle: object = isHome ? { w: "0", flex: 1, align: "center" } : { ml: "16px" }

  const getRecordById = (id: string) => {
    return records.find((record: any) => record.id === id);
  }

  const contextValues = {
    records,
    selectedMonth,
    totalEarnings,
    expenses,
    totalExpenses,
    selectedMonthExpense,
    setRecords: (records: any) => setRecords(records),
    getRecordById: (id: string) => getRecordById(id),
    setSelectedMonth: (selectedMonth: any) => setSelectedMonth(selectedMonth),
    setTotalEarnings: (totalEarnings: any) => setTotalEarnings(totalEarnings),
    setExpenses: (expenses: any) => setExpenses(expenses),
    setSelectedMonthExpense: (selectedMonth: any) => setSelectedMonthExpense(selectedMonth),
    setTotalExpenses: (totalExpenses: any) => setTotalExpenses(totalExpenses)
  }

  const renderHeader = () => (
    <Flex boxShadow='md'
      w="100%" h="50px"
      bg='blue.500'
      zIndex={1}
      position="fixed"
      top={0}
      pl="12px"
      alignItems="center">

      {!isHome && <ArrowBackIcon color="white" boxSize={6} onClick={() => navigate(-1)} />}
      <Text as='b' color="white" {...titleStyle} >Dr.Madhuris Pet Clinic</Text>
    </Flex>
  )
  return (
    <AppContext.Provider
      value={contextValues} >

      <ChakraProvider>
        {renderHeader()}
        <Box mt="60px"> <Outlet /></Box>
      </ChakraProvider>

    </AppContext.Provider >
  )
}

export default App
