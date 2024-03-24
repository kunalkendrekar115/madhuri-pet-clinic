import axios from 'axios';
import moment from 'moment'


export function generatePrescription(record: any) {

    const getRxData = (record: any) => {
        return record.treatment.split(',').map((item: any) => {
            const treatmentDesctiption = item.split(':');
            if (treatmentDesctiption.length === 1) { return treatmentDesctiption[0]; }
            else {
                const withDueDate = treatmentDesctiption[1].split('#');
                if (withDueDate.length > 1) return `${treatmentDesctiption[0]} ${withDueDate[0]} &nbsp;&nbsp;&nbsp; <b>(Next Due Date: ${withDueDate[1]})</b>`
                else return `${treatmentDesctiption[0]} ${treatmentDesctiption[1]}`
            }
        })
    }

    return new Promise(async (resolve, reject) => {
        try {
            var body = JSON.stringify({
                ownerName: record.ownerName,
                address: record.address,
                ownerInfo: `${record.ownerName}, ${record.address}`,
                petName: record.petName,
                species: record.species,
                breed: record.breed,
                weight: record.weight,
                color: record.color,
                age: record.age,
                sex: record.gender,
                fileDate: moment(new Date(record.date)).format("DD-MMM-yyyy"),
                date: moment(new Date(record.date)).format("DD MMM yyyy"),
                followupDate: record.followupDate ? moment(new Date(record.followupDate)).format("DD MMM yyyy") : "",
                historyObserved: record.history,
                rxData: getRxData(record),
                advice: record.treatmentDescription
            });

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
            return;

        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}