import axios from 'axios';
import moment from 'moment'
import { getCardRecords } from '../api/index';


export function generateCard(record: any) {

    const formatTreatment = (record: any, type: any) => {
        const typeTreatments = record.treatment.split(',').filter((item: any) => item.includes(type));
        console.log(typeTreatments);

        const formattedTreatments = typeTreatments.map((item: any) => {
            const splitValues = item.split(':');
            const typeValue = splitValues[1].split('#')
            let dueDate = '-'
            if (typeValue.length > 1)
                dueDate = typeValue[1];

            return {
                name: typeValue[0].trim(),
                dateGiven: moment(new Date(record.date)).format("DD MMM yyyy"),
                dueDate
            }
        })

        return formattedTreatments
    }
    return new Promise(async (resolve, reject) => {
        try {

            const cardRecordResponse = await getCardRecords(`${record.mobileNumber},${record.ownerName},${record.petName}`)
            const cardRecords = cardRecordResponse?.data?.records
            if (!cardRecords.length) {
                reject('No Records Found')
                return;
            }

            const vaccinations = cardRecords.filter(({ treatment }: any) => treatment.includes('Vaccination'))
                .reduce((acc: any, item: any) => {
                    return [...acc, ...formatTreatment(item, 'Vaccination')]
                }, [])

            const dewormings = cardRecords.filter(({ treatment }: any) => treatment.includes('Deworming')).reduce((acc: any, item: any) => {
                return [...acc, ...formatTreatment(item, 'Deworming')]
            }, [])

            var body = JSON.stringify({
                ownerName: record.ownerName,
                address: record.address,
                ownerInfo: `${record.ownerName}, ${record.address}`,
                petName: record.petName,
                weight: record.weight,
                age: record.age,
                color: record.color,
                species: record.species,
                breed: record.breed,
                sex: record.gender,
                vaccinations,
                dewormings,
                type: 'card'
            });

            console.log(JSON.parse(body));


            var config = {
                method: 'post',
                url: 'https://wpxz57lyrc.execute-api.us-east-1.amazonaws.com/dev/generate-pdf',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: body
            };

            const response = await axios(config)
            const pdfUrl = response.data;
            resolve(pdfUrl)

        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}