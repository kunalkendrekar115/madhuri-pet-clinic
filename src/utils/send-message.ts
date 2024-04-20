import axios from 'axios';
import moment from 'moment';

function getWhatsAppConfig(data: any) {
    const whatsappConfig: any = {
        method: 'post',
        url: 'https://graph.facebook.com/v17.0/122103632132007885/messages',
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data
    };
    return whatsappConfig
}

function getCardFields(type: any, ownerName: any, petName: any, followupFor: any, followupDate: any) {

    return [{
        "type": "text",
        "text": ownerName
    },
    {
        "type": "text",
        "text": type
    },
    {
        "type": "text",
        "text": petName
    },
    {
        "type": "text",
        "text": followupFor
    },
    {
        "type": "text",
        "text": (followupDate !== 'NA' && followupDate !== '-') ? moment(new Date(followupDate)).format("DD MMM yyyy") : "NA"
    }]
}

function getPrescriptionFields(ownerName: any, petName: any) {

    return [{
        "type": "text",
        "text": ownerName
    },
    {
        "type": "text",
        "text": petName
    }]
}

export function sendWhatsppMessage(pdfUrl: any, mobileNumber: any, ownerName: any, petName: any, type = "Prescription", followupFor = "NA", followupDate = "NA") {

    return new Promise(async (resolve, reject) => {
        try {

            var data = JSON.stringify({
                "messaging_product": "whatsapp",
                "to": `91${mobileNumber}`,
                "type": "template",
                "template": {
                    "name": type === 'Prescription' ? "pet_clinic_prescription" : "pet_clinic_card",
                    "language": {
                        "code": "en"
                    },
                    "components": [
                        {
                            "type": "header",
                            "parameters": [
                                {
                                    "type": "document",
                                    "document": {
                                        "link": pdfUrl,
                                        "filename": `${petName} ${type}`
                                    }
                                }
                            ]
                        },
                        {
                            "type": "BODY",
                            "parameters": type === 'Prescription' ? getPrescriptionFields(ownerName, petName)
                                : getCardFields(type, ownerName, petName, followupFor, followupDate)
                        }
                    ]
                }
            });


            const messageResponse = await axios(getWhatsAppConfig(data))
            resolve(messageResponse);

        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

export function askRatingsOnWhatsApp(ownerName: any, mobileNumber: any) {

    return new Promise(async (resolve, reject) => {
        try {

            var data = JSON.stringify({
                "messaging_product": "whatsapp",
                "to": `91${mobileNumber}`,
                "type": "template",
                "template": {
                    "name": "ask_ratings",
                    "language": {
                        "code": "en"
                    },
                    "components": [
                        {
                            "type": "BODY",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": ownerName
                                }
                            ]
                        }
                    ]
                }
            });


            const messageResponse = await axios(getWhatsAppConfig(data))
            resolve(messageResponse);

        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}