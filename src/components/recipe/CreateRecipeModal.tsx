import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import CreateRecipe from './CreateRecipe'

const CreateRecipeModal = () =>
{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [scrollBehavior, setScrollBehavior] = useState('inside')
    
    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>

            <Modal size={"6xl"} isOpen={isOpen} onClose={onClose} scrollBehavior={scrollBehavior}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <CreateRecipe />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateRecipeModal
