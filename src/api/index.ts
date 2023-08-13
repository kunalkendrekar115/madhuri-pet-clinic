import axios from 'axios';
import { getCookie } from '../utils/cookies';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

const getHeader = () => ({
    headers: {
        Authorization: getCookie(),
        "x-api-key": import.meta.env.VITE_API_KEY
    }
})

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.config.url !== "authenticate" && [401, 403].includes(error.response.status)) {
        window.location.href = "/login";
        return;
    }
    throw error;
});

export const getRecords = (): any => instance.get("records", getHeader())


export const getRecordsById = (id: string): any => instance.get(`records?id=${id}`, getHeader())
export const getRecordsByDate = (from: any, to: any): any => instance.get(`records?from=${from}&to=${to}`, getHeader())
export const getRecordsBysearchQuery = (searchQuery: any): any => instance.get(`records?searchQuery=${searchQuery}`, getHeader())
export const getCardRecords = (cardRecords: any): any => instance.get(`records?cardRecords=${cardRecords}`, getHeader())

export const deleteRecord = (id: string, date: string): any => instance.delete(`records?id=${id}&date=${date}`, getHeader())


export const saveRecords = (body: object): any => instance.post("records", body, getHeader())
export const updateRecord = (id: string, date: string, body: object): any => instance.patch(`records?id=${id}&date=${date}`, body, getHeader())

export const authenticate = (body: object): any => instance.post("authenticate", body, getHeader())

export const getExpenses = (): any => instance.get("expenditure", getHeader())
export const getExpenseByDate = (from: any, to: any): any => instance.get(`expenditure?from=${from}&to=${to}`, getHeader())
export const saveExpense = (body: object): any => instance.post("expenditure", body, getHeader())
export const saveTreatment = (body: object): any => instance.post("treatments", body, getHeader())

export const getTreatments = (): any => instance.get("treatments", getHeader())
