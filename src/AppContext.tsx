import React from "react";

interface IContext {
    records?: any,
    selectedMonth?: any,
    selectedMonthExpense?: any,
    setRecords?: any,
    setExpenses?: any,
    expenses?: any,
    setSelectedMonth?: any,
    setSelectedMonthExpense?: any,
    totalEarnings?: any,
    totalExpenses?: any
    setTotalEarnings?: any
    setTotalExpenses?: any,
    getRecordById?: any
}

export const AppContext = React.createContext<IContext>({})