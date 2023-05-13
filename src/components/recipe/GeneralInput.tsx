import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'
import { UseFormReturnType } from '@mantine/form';
import { ingredients, Instruction } from '@prisma/client';
import React, { FunctionComponent, LegacyRef, useEffect, useRef, useState } from 'react'
type GeneralInputProps = {
    form: UseFormReturnType<{
        name: string;
        description: string;
        totalTime: number;
        Ingredients: ingredients[];
        instructions: Instruction[];
    }, (values: {
        name: string;
        description: string;
        totalTime: number;
        Ingredients: ingredients[];
        instructions: Instruction[];
    }) => {
        name: string;
        description: string;
        totalTime: number;
        Ingredients: ingredients[];
        instructions: Instruction[];
    }>
    custom: boolean;
    setCustom: React.Dispatch<React.SetStateAction<boolean>>;
};
const GeneralInput: FunctionComponent<GeneralInputProps> = (props) =>
{
    const { form, custom, setCustom } = props;
    const [timer, setTimer] = useState<number | null | NodeJS.Timeout>(null)
    const nameRef = useRef<LegacyRef<HTMLInputElement> | undefined>();
    const totalTimeRef = useRef<LegacyRef<HTMLInputElement> | undefined>();
    const descriptionRef = useRef<LegacyRef<HTMLInputElement> | undefined>();

    const inputChanged = () =>
    {
        clearTimeout(timer as number)

        //Debounce, läheb tööle siis kui kirjutamine lopetakse
        const newTimer = setTimeout(() =>
        {
            form.setFieldValue(`name`, nameRef?.current?.value);
            form.setFieldValue(`description`, descriptionRef?.current?.value);
            form.setFieldValue(`totalTime`, totalTimeRef?.current?.value);

        }, 500)

        setTimer(newTimer)
    }

    useEffect(() =>
    {
        if (nameRef.current && descriptionRef.current && totalTimeRef.current)
        {
            nameRef.current.value = form?.values?.name;
            descriptionRef.current.value = form?.values?.description;
            totalTimeRef.current.value = form?.values?.totalTime;
            setCustom(false);
        }
    }, [custom])
    return (
        <>
            <FormControl isRequired>
                <FormLabel>Recipe Name</FormLabel>
                <Input type='name' ref={nameRef} onChange={() => inputChanged()} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Total time (<small style={{ margin: 0 }} onChange={() => inputChanged()}>In minutes</small>)</FormLabel>
                <Input type='number' ref={totalTimeRef} />
            </FormControl>
            <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea placeholder='Mexican dish' ref={descriptionRef} onChange={() => inputChanged()} />
            </FormControl>
        </>
    )
}

export default GeneralInput
