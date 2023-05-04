import { Card, Container, CardHeader, Box, Heading, Text, Image, CardBody, CardFooter, Button, Stack, StackDivider } from '@chakra-ui/react';
import React from 'react'

export const recipe  = () => {
  return (
    <Container>
      <Card>
      <Image
          objectFit='cover'
          src='https://images.pexels.com/photos/6287527/pexels-photo-6287527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt='Chakra UI'
        />

        <CardBody>
        <Card>
          <CardHeader>
            <Heading size='md'>Pasta Bolognese</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Preparation time:
                </Heading>
                <Text pt='2' fontSize='sm'>
                  60 minutes
                </Text>
              </Box>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Overview
                </Heading>
                <Text pt='2' fontSize='sm'>
                  Check out the overview of your clients.
                </Text>
              </Box>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Guidelines:
                </Heading>
                <Text pt='2' fontSize='sm'>
                  Boil water
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
        </CardBody>
        
        <CardFooter
          justify='space-between'
          flexWrap='wrap'
          sx={{
            '& > button': {
              minW: '136px',
            },
          }}
        >
          <Button flex='1' variant='ghost'>
            Like
          </Button>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default recipe;