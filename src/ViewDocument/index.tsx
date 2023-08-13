
import { Box, Button, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { sendWhatsppMessage } from '../utils/send-message';

const ViewDocument = () => {

    const useQuery = () => new URLSearchParams(useLocation().search);

    const params = useQuery<any>()
    const pdfUrl = params.get('pdfUrl')
    const mobileNumber = params.get('mobile')
    const petName = params.get('petName')
    const ownerName = params.get('ownerName')

    const handleWhatsappClick = async () => {

        try {
            await sendWhatsppMessage(pdfUrl, mobileNumber, ownerName, petName);
        } catch (error) { alert(error) }
    }
    return (
        <Box height="90vh">
            <iframe src={pdfUrl}
                width='100%'
                height="85%"></iframe>

            <Flex padding="20px">
                <Button
                    colorScheme='teal'
                    onClick={handleWhatsappClick}
                    size='md'>
                    Send To Whatspp
                </Button>
            </Flex>
        </Box>
    )
}

export default ViewDocument