import axios from 'axios';
import moment from 'moment'


export function generatePrescription(record: any) {

    const getRxData = (record: any) => {
        return record.treatment.split(',').map((item: any) => {
            const treatmentDesctiption = item.split(':');
            if (treatmentDesctiption.length === 1) { return treatmentDesctiption[0]; }
            else {
                const withDueDate = treatmentDesctiption[1].split('#');
                if (withDueDate.length > 1) return `${treatmentDesctiption[0]} ${withDueDate[0]}  (Next Followup Date: ${withDueDate[1]})`
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
                age: record.age,
                sex: record.gender,
                date: moment(new Date(record.date)).format("DD MMM yyyy"),
                followupDate: record.followupDate ? moment(new Date(record.followupDate)).format("DD MMM yyyy") : '-',
                historyObserved: record.history,
                rxData: getRxData(record),
                advice: record.treatmentDescription
            });

            var config = {
                method: 'post',
                url: 'https://70npplrfkg.execute-api.us-east-1.amazonaws.com/develop/Madhuri-Pet-Clinic-PDF-Generator-dev-generate-pdf',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: body
            };

            const response = await axios(config)
            const pdfUrl = response.data;
            resolve(pdfUrl)
            return;

            // var data = JSON.stringify({
            //     "messaging_product": "whatsapp",
            //     "to": `91${record.mobileNumber}`,
            //     "type": "template",
            //     "template": {
            //         "name": "pet_clinic",
            //         "language": {
            //             "code": "en"
            //         },
            //         "components": [
            //             {
            //                 "type": "header",
            //                 "parameters": [
            //                     {
            //                         "type": "document",
            //                         "document": {
            //                             "link": pdfUrl,
            //                             "filename": `${record.petName} Prescription`
            //                         }
            //                     }
            //                 ]
            //             },
            //             {
            //                 "type": "BODY",
            //                 "parameters": [
            //                     {
            //                         "type": "text",
            //                         "text": record.ownerName
            //                     },
            //                     {
            //                         "type": "text",
            //                         "text": "Prescription"
            //                     },
            //                     {
            //                         "type": "text",
            //                         "text": record.petName
            //                     }
            //                 ]
            //             }
            //         ]
            //     }
            // });

            // const whatsappConfig: any = {
            //     method: 'post',
            //     url: 'https://graph.facebook.com/v17.0/122511984173616/messages',
            //     headers: {
            //         'Authorization': 'Bearer EAA0JSqrlV3IBO3TZA7fQIbgJSM8U7HZBc9PTw0RnnBXtuVy4ENJu4iEIA99os3rnOreprlb6LX40RGVVgUE731PCLKYxZAQjNaenY5D8JrK8uTY67BwFHViVIUZBbffOMh8wMAxwHX5ZCB05ZANsUHNLbIPFZBqNzByyvsFYqlp0BSoZCq6OK74qGjNNZBZAZAiYZCczK1ohfjH6giSfJchs',
            //         'Content-Type': 'application/json'
            //     },
            //     data: data
            // };

            // const messageResponse = await axios(whatsappConfig)
            // console.log(messageResponse);
            // resolve(messageResponse);

        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}