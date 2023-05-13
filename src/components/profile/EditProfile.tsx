import { Heading, FormControl, FormLabel, Input, Textarea, Button, useToast, Modal, ModalOverlay, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ButtonGroup } from '@chakra-ui/react'
import { useForm } from '@mantine/form'
import { type User } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { type FunctionComponent, useEffect, useState } from 'react'
import { EndPoint } from '~/constants/EndPoints';
import { type UserReqType, type UserResType } from '~/pages/api/user';

type EditProfilType = {
    user: User;
    isModal?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
}
const EditProfile: FunctionComponent<EditProfilType> = (props) =>
{
    const { user, isModal, isOpen, onClose } = props;
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { data: session } = useSession();
    const router = useRouter();
    const form = useForm({
        initialValues: {
            nickname: user?.name,
            imageLink: user?.image,
            bio: user?.bio,
            website: user?.website,
        },
        validate: {
            nickname: (value) => (value.length < 3 ? 'Nickname must be at least 3 characters long' : null),
        }
    })
    useEffect(() =>
    {
        form.setValues({
            nickname: user?.name,
            imageLink: user?.image,
            bio: user?.bio,
            website: user?.website,
        })
    }, [user, isOpen])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close?: boolean) =>
    {
        event.preventDefault()
        const data: UserReqType = {
            name: form.values.nickname,
            image: form.values.imageLink ?? "",
            bio: form.values.bio ?? "",
            website: form.values.website ?? "",
        }

        setLoading(true)
        await axios.put(`${window.origin}${EndPoint.USER}`, data).then((res) =>
        {
            const newData = res.data as UserResType;

            if (newData.success)
            {
                void router.replace(router.asPath, undefined, { scroll: false });

                if (close) onClose?.();

                toast({
                    title: 'Updated',
                    description: "Account info updated",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }
            else
            {
                toast({
                    title: 'Error',
                    description: newData?.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        }).catch((err: Error | AxiosError) =>
        {
            toast({
                title: 'Error',
                description: err.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }).finally(() => setLoading(false))
    }

    if (isModal)
    {
        return (
            <Modal isOpen={isOpen as boolean} onClose={onClose as (() => void)} size="6xl" scrollBehavior={"inside"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Edit Profile</ModalHeader>
                    <ModalBody>
                        <FormControl id="nickname" mb={4}>
                            <FormLabel>Nickname</FormLabel>
                            <Input
                                type="text"
                                {...form.getInputProps("nickname")}
                            />
                        </FormControl>

                        <FormControl id="imageLink" mb={4}>
                            <FormLabel>Image Link</FormLabel>
                            <Input
                                type="url"
                                {...form.getInputProps("imageLink")}
                            />
                        </FormControl>

                        <FormControl id="bio" mb={4}>
                            <FormLabel>Bio</FormLabel>
                            <Textarea
                                {...form.getInputProps("bio")}
                            />
                        </FormControl>

                        <FormControl id="website" mb={4}>
                            <FormLabel>Website</FormLabel>
                            <Input
                                type="url"
                                {...form.getInputProps("website")}
                            />
                        </FormControl>


                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup>

                            <Button
                                onClick={(event) => void handleSubmit(event, true)}
                                loadingText='Saving'
                                isLoading={loading}
                                colorScheme="orange"
                                type="submit">Save and close</Button>

                            <Button
                                onClick={(event) => void handleSubmit(event, false)}
                                loadingText='Saving'
                                isLoading={loading}
                                colorScheme="green"
                                type="submit">Save</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>

            </Modal >
        )
    }
    else
    {

        return (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <form onSubmit={(e) => handleSubmit(e)} >


                <Heading size="lg" mb={6}>Edit Profile</Heading>

                <FormControl id="nickname" mb={4}>
                    <FormLabel>Nickname</FormLabel>
                    <Input
                        type="text"
                        {...form.getInputProps("nickname")}
                    />
                </FormControl>

                <FormControl id="imageLink" mb={4}>
                    <FormLabel>Image Link</FormLabel>
                    <Input
                        type="url"
                        {...form.getInputProps("imageLink")}
                    />
                </FormControl>

                <FormControl id="bio" mb={4}>
                    <FormLabel>Bio</FormLabel>
                    <Textarea
                        {...form.getInputProps("bio")}
                    />
                </FormControl>

                <FormControl id="website" mb={4}>
                    <FormLabel>Website</FormLabel>
                    <Input
                        type="url"
                        {...form.getInputProps("website")}
                    />
                </FormControl>

                <Button
                    loadingText='Saving'
                    isLoading={loading}
                    colorScheme="green"
                    type="submit">Save</Button>
            </form>

        )
    }

}

export default EditProfile
