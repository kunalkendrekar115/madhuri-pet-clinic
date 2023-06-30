import { Box, useToast } from "@chakra-ui/react"
import { Input, Button } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import { useState } from 'react';

import { setCookie } from "../utils/cookies";
import { authenticate } from '../api';

const Login = () => {

    const [value, setValue] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const toast = useToast()

    const navigate = useNavigate()

    const handleClick = async () => {
        setLoading(true)
        try {
            const { data } = await authenticate({ password: value });

            setCookie(data.token, 7);
            setLoading(false);
            navigate("/")

        } catch (error) {
            console.log('error', error)
            setLoading(false)
            toast({
                title: "Login Failed",
                status: "error",
                position: "top",
            })
        }
    }

    return <Box padding="32px">
        <Input
            size='md'
            type="password"
            value={value}
            placeholder='Enter Login Password'
            onChange={(e) => setValue(e.target.value)} />

        <Button
            colorScheme='blue'
            type="submit"
            disabled={!value}
            isLoading={loading}
            onClick={handleClick}
            mt="24px" w="100%">Submit</Button>
    </Box>
}

export default Login