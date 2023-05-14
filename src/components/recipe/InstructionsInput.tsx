import { IconButton, Input, InputGroup } from '@chakra-ui/react'
import { Center } from '@mantine/core'
import { type UseFormReturnType } from '@mantine/form'
import { type ingredients, type Instruction } from '@prisma/client'
import { IconGripVertical, IconX } from '@tabler/icons-react'
import React, { type FunctionComponent, type LegacyRef, useRef, useState, useEffect } from 'react'
import { DraggableLocation, type DraggableProvided } from 'react-beautiful-dnd'

type InstructionsInputProps = {
    index: number,
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
    provided: DraggableProvided;
    custom: boolean;
    setCustom: React.Dispatch<React.SetStateAction<boolean>>;
}
const InstructionsInput: FunctionComponent<InstructionsInputProps> = (props) =>
{
    const { index, form, provided, custom, setCustom } = props;
    const [timer, setTimer] = useState<number | null | NodeJS.Timeout>(null)
    const stepRef = useRef<LegacyRef<HTMLInputElement> | undefined>();
    const [test, setTest] = useState<string>('');

    const inputChanged = () =>
    {
        clearTimeout(timer as number)

        //Debounce, läheb tööle siis kui kirjutamine lopetakse
        //Sama asi nagu IngridientsInput.tsx failis
        const newTimer = setTimeout(() =>
        {
            form.setFieldValue(`instructions.${index}.step`, stepRef?.current?.value);

        }, 500)

        setTimer(newTimer)
    }

    useEffect(() =>
    {
        if (stepRef.current)
        {
                stepRef.current.value = form?.values?.instructions[index]?.step;
                setCustom(false);
        }
    }, [form?.values?.instructions[index], custom])


    return (
        <InputGroup mb={2} ref={provided.innerRef} {...provided.draggableProps} gap={5}>
            <Center {...provided.dragHandleProps}>
                <IconGripVertical size="1.2rem" />
            </Center>
            <Input isRequired ref={stepRef} onChange={() => inputChanged()} placeholder='Step' />
            <IconButton aria-label='Remove recipe' onClick={() => form.removeListItem("instructions", index)} icon={<IconX />} ></IconButton>
        </InputGroup >
    )
}

export default InstructionsInput
