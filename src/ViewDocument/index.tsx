
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendWhatsppMessage } from '../utils/send-message';
import { useState, useEffect } from 'react';

const ViewDocument = () => {

    const useQuery = () => new URLSearchParams(useLocation().search);
    const [loading, setLoading] = useState<boolean>(false)
    const [docUrl, setDocUrl] = useState<string>('')

    const navigate = useNavigate()
    const params = useQuery()
    const pdfUrl = params.get('pdfUrl') || ""
    const mobileNumber = params.get('mobile')
    const petName = params.get('petName')
    const ownerName = params.get('ownerName')
    const type = params.get('type') || "Prescription"
    const followupDate = params.get('followupDate') || ""
    const followupFor = params.get('followupFor') || ""


    const [inputMobile, setInputMobile] = useState<string>(mobileNumber || '')

    useEffect(() => {
        setTimeout(() => {
            const docUrl = `https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`
            console.log(docUrl)
            setDocUrl(docUrl)
        }, 500)
    }, [pdfUrl])

    const handleWhatsappClick = async () => {

        try {
            setLoading(true)
            await sendWhatsppMessage(pdfUrl, inputMobile, ownerName, petName, type, followupFor, followupDate);
            navigate("/")
        } catch (error) { alert(error) }
        finally {
            setLoading(false)
        }
    }
    return (
        <Box height="90vh">
            <iframe src={docUrl}
                width='100%'
                height="85%"></iframe>

            <Flex padding="20px" gap="16px">

                <Input placeholder="Mobile No" w="50%" type="number" value={inputMobile} onChange={(e) => setInputMobile(e.target.value)} />

                <Button
                    colorScheme='teal'
                    isLoading={loading}
                    disabled={inputMobile.length !== 10}
                    onClick={handleWhatsappClick}
                    size='md'>
                    Send To WhatsApp
                </Button>
            </Flex>
        </Box>
    )
}

export default ViewDocument