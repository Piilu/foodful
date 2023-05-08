import { Divider, FormLabel, IconButton, Input } from '@chakra-ui/react';
import { Grid } from '@mantine/core';
import { type UseFormReturnType } from '@mantine/form';
import { type ingredients, type Instruction } from '@prisma/client';
import { IconX } from '@tabler/icons-react';
import { useState, useRef, useEffect, LegacyRef } from 'react';

type IngridientsInputProps = {
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
    custom: boolean;
    setCustom: React.Dispatch<React.SetStateAction<boolean>>;
};

function IngridientsInput(props: IngridientsInputProps)
{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { index, form,setCustom,custom } = props;
    const [timer, setTimer] = useState<number | null | NodeJS.Timeout>(null)
    const nameRef = useRef<LegacyRef<HTMLInputElement> | undefined>();
    const descriptionRef = useRef<LegacyRef<HTMLInputElement> | undefined>();
    const amountRef = useRef<LegacyRef<HTMLInputElement> | undefined>();


    //Eee siin mingi x asi kuidas hoida ära liiga palju rerenderimist
    //Ainus asi mis voib juhtuda on see et kui sisestad teksti ja vajutad kohe save siis ei pruugi see viimane sisestatud tekst sinna jääda. Nede tegevuste vahel peab olema vähemalt 500ms
    const inputChanged = () =>
    {
        clearTimeout(timer as number)

        //Debounce, läheb tööle siis kui kirjutamine lopetakse
        const newTimer = setTimeout(() =>
        {
            form.setFieldValue(`Ingredients.${index}.name`, nameRef?.current?.value);
            form.setFieldValue(`Ingredients.${index}.description`, descriptionRef?.current?.value);
            form.setFieldValue(`Ingredients.${index}.amount`, amountRef?.current?.value);

        }, 500)

        setTimer(newTimer)
    }

    useEffect(() =>
    {
        if (nameRef.current && descriptionRef.current && amountRef.current)
        {
            console.log("useEffect")
            nameRef.current.value = form?.values?.Ingredients[index]?.name;
            descriptionRef.current.value = form?.values?.Ingredients[index]?.description;
            amountRef.current.value = form?.values?.Ingredients[index]?.amount;
            setCustom(false);
        }
    }, [custom])

    return (
        <Grid key={index} grow>
            <Divider />
            <Grid.Col span={3} miw={"15em"}>
                <FormLabel>Name</FormLabel>
                <Input ref={nameRef} onChange={() => inputChanged()} placeholder='Eggs' />
            </Grid.Col>
            <Grid.Col span={5} miw={"15em"}>
                <FormLabel>Description</FormLabel>
                <Input ref={descriptionRef} onChange={() => inputChanged()} placeholder='Details' />
            </Grid.Col>
            <Grid.Col span={2} miw={"15em"}>
                <FormLabel>Amount</FormLabel>
                <Input ref={amountRef} onChange={() => inputChanged()} placeholder='2tk' />
            </Grid.Col>
            <Grid.Col span={1} mt={"auto"} miw={"5em"}>
                <IconButton w={"100%"} mt={"auto"} aria-label='Remove recipe' onClick={() => form.removeListItem("Ingredients", index)} icon={<IconX />} ></IconButton>
            </Grid.Col>
        </Grid>
    );
}

export default IngridientsInput
