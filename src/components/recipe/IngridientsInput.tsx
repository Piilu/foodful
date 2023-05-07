import { Divider, FormLabel, IconButton, Input } from '@chakra-ui/react';
import { Grid } from '@mantine/core';
import { type UseFormReturnType } from '@mantine/form';
import { type ingredients, type Instruction } from '@prisma/client';
import { IconX } from '@tabler/icons-react';

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
};

function IngridientsInput(props: IngridientsInputProps)
{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { index, form } = props;

    return (
        <Grid key={index} grow>
            <Divider />
            <Grid.Col span={3} miw={"15em"}>
                <FormLabel>Name</FormLabel>
                <Input  {...form.getInputProps(`Ingredients.${index}.name`)} placeholder='Eggs' />
            </Grid.Col>
            <Grid.Col span={5} miw={"15em"}>
                <FormLabel>Description</FormLabel>
                <Input {...form.getInputProps(`Ingredients.${index}.description`)} placeholder='Details' />
            </Grid.Col>
            <Grid.Col span={2} miw={"15em"}>
                <FormLabel>Amount</FormLabel>
                <Input {...form.getInputProps(`Ingredients.${index}.amount`)} placeholder='2tk' />
            </Grid.Col>
            <Grid.Col span={1} mt={"auto"} miw={"5em"}>
                <IconButton w={"100%"} mt={"auto"} aria-label='Remove recipe' onClick={() => form.removeListItem("Ingredients", index)} icon={<IconX />} ></IconButton>
            </Grid.Col>
        </Grid>
    );
}

export default IngridientsInput
