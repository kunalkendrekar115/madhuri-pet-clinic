import axios from 'axios';

export function sendWhatsppMessage(pdfUrl: any, mobileNumber: any, ownerName: any, petName: any) {

    return new Promise(async (resolve, reject) => {
        try {

            var data = JSON.stringify({
                "messaging_product": "whatsapp",
                "to": `91${mobileNumber}`,
                "type": "template",
                "template": {
                    "name": "pet_clinic",
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
                                        "filename": `${petName} Prescription`
                                    }
                                }
                            ]
                        },
                        {
                            "type": "BODY",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": ownerName
                                },
                                {
                                    "type": "text",
                                    "text": "Prescription"
                                },
                                {
                                    "type": "text",
                                    "text": petName
                                }
                            ]
                        }
                    ]
                }
            });

            const whatsappConfig: any = {
                method: 'post',
                url: 'https://graph.facebook.com/v17.0/122511984173616/messages',
                headers: {
                    'Authorization': 'Bearer EAA0JSqrlV3IBO0m03ZARywZB5Ld6rvH8mIqm2x1s4KZCaAiqXIRXVb3QArTeFzz9k4bjmPpqKhygrkGB2y29yRfzZAOVqhmZBkhJcKa30Vx9SLTanXZAyuZCVinBC1zNznIZAJ7YKpf1CZA6ocGEvAnjycLyjpipWGYYQlB36FshjR9xuJl2L6cZCMRviLsr0OIVodFbihZC5ogF1AAvkwZD',
                    'Content-Type': 'application/json'
                },
                data: data
            };

            const messageResponse = await axios(whatsappConfig)
            console.log(messageResponse);
            resolve(messageResponse);

        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}