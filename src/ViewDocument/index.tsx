
import { Box, Button, Flex } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendWhatsppMessage } from '../utils/send-message';
import { useState, useEffect } from 'react';

const ViewDocument = () => {

    const useQuery = () => new URLSearchParams(useLocation().search);
    const [loading, setLoading] = useState<boolean>(false)
    const [pdfLink, setPdfLink] = useState<string>("")
    const navigate = useNavigate()
    const params = useQuery()
    const pdfUrl = params.get('pdfUrl') || ""
    const mobileNumber = params.get('mobile')
    const petName = params.get('petName')
    const ownerName = params.get('ownerName')
    const type = params.get('type') || "Prescription"

    useEffect(() => {
        setTimeout(() => {
            setPdfLink(pdfUrl)
        }, 500)

    }, [pdfUrl])

    const handleWhatsappClick = async () => {

        try {
            setLoading(true)
            await sendWhatsppMessage(pdfUrl, mobileNumber, ownerName, petName, type);
            navigate("/")
        } catch (error) { alert(error) }
        finally {
            setLoading(false)
        }
    }
    return (
        <Box height="90vh">
            <iframe src={pdfLink}
                width='100%'
                height="85%"></iframe>

            <Flex padding="20px">
                <Button
                    colorScheme='teal'
                    isLoading={loading}
                    onClick={handleWhatsappClick}
                    size='md'>
                    Send To Whatspp
                </Button>
            </Flex>
        </Box>
    )
}

export default ViewDocument