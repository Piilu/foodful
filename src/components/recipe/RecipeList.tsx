import React, { useEffect, useRef, useState } from 'react'
import Recipe from './Recipe'
import axios from 'axios';
import { EndPoint } from '~/constants/EndPoints';
import { InputGroup, InputLeftElement, Input, Checkbox, useDisclosure, Box } from "@chakra-ui/react";
import { type Recipe as RecipeBackType } from "@prisma/client";
import { Group, Pagination } from '@mantine/core';
import { useScrollIntoView, useDebouncedState } from '@mantine/hooks';
import { Loader } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import SearchNotFound from '../custom/SearchNotFound';
import CreateRecipe from './CreateRecipe';
import { type FullRecipeData } from '~/constants/types';
import { type RecipeResListGetType } from '~/pages/api/recipe/list';
import { type RecipeReqListType } from '~/pages/api/recipe/list';

type RecipeListType = {
    limit: number;
    page: number;
    search?: boolean;
    userId?: string;
    showUpperPagination?: boolean;
    showFavorites?: boolean;
    orderCreatedAt?: "asc" | "desc";
}

function RecipeList(props: RecipeListType)
{
    const [items, setItems] = useState<RecipeBackType[] | []>([]);
    const { limit, page, search, userId, showUpperPagination, orderCreatedAt, showFavorites } = props;
    const [pages, setPages] = useState<number>(1);
    const [activePage, setActivePage] = useState<number>(page);
    const [value, setValue] = useDebouncedState<string | undefined>(undefined, 300)
    const [loading, setLoading] = useState<boolean>(true);
    const [favorite, setFavorite] = useState<boolean>(false);
    const router = useRouter();
    const checkRef = useRef<any>();
    const [openRecipeId, setOpenRecipeId] = useState<number | null>(null);
    const [currentRecipe, setCurrentRecipe] = useState<FullRecipeData | null>(null);
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 60,
    });
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handlePageChange = (page: number) =>
    {
        setActivePage(page);
        scrollIntoView({
            alignment: 'center',
        })
    }


    const openRecipeModal = async (id: number | undefined) =>
    {
        if (id !== undefined)
        {
            setOpenRecipeId(id);
            setCurrentRecipe(items?.find((item) => item.id === id));
            onOpen();
        }
    }
    useEffect(() =>
    {
        if (showFavorites)
        {
            void router.push({ query: { ...router.query, favorite: checkRef.current.checked } }, undefined, { shallow: true, });
        }
        void getRecipes();
    }, [activePage, favorite]);

    useEffect(() =>
    {
        if (value !== undefined)
        {
            void getRecipes();
        }
        void getRecipes();
    }, [router, value]);


    const getRecipes = async () =>
    {
        const data: RecipeReqListType = {
            page: activePage - 1,
            take: limit,
            searchName: value,
            userId: userId,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            favorite: showFavorites ? checkRef?.current?.checked : false ?? false,
            orderCreatedAt: orderCreatedAt ?? "desc"
        }
        setLoading(true);
        await axios.post(`${window.origin}/${EndPoint.RECIPELIST}`, data).then((res) =>
        {
            const newData = res.data as RecipeResListGetType;

            if (newData.success)
            {
                setItems(newData.recipes as RecipeBackType[]);
                setPages(Math.ceil(newData.totalRecipes / limit));
            } else
            {
                console.log(newData.error);
            }
        }).catch((err) =>
        {
            console.log(err);
        }).finally(() => { setLoading(false) });

    };

    return (
        <Box pb={10}>
            {isOpen ?
                <CreateRecipe currentRecipe={currentRecipe} isOpen={isOpen} isModal onClose={onClose} />
                : null}
            {search ?
                <InputGroup mb={5}>
                    <InputLeftElement
                        pointerEvents='none'
                        children={<IconSearch />}
                    />
                    <Input type='text' onChange={(e) => { setValue(e.target.value) }} placeholder='Search by name' />
                </InputGroup> : null}

            <Group position='right' mb={10}>
                {/* {showUpperPagination ?
                    <Pagination mb={10} value={activePage} onChange={handlePageChange} total={pages} />
                    : null} */}
                {showFavorites ?
                    <Checkbox ref={checkRef} colorScheme='green' onChange={setFavorite} checked={favorite} defaultChecked={false}>
                        Favorites
                    </Checkbox>
                    : null}
            </Group>
            <div ref={targetRef}></div>
            {loading ? <Loader mb={10} color='green' mx={"auto"} /> : null}
            {items?.length !== 0 ? items.map((item) =>
            {
                return (
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    <Recipe openRecipeModal={openRecipeModal} key={item.id} horizontal recipe={item as FullRecipeData} userId={item.userId} />
                )
            }) : <SearchNotFound value="Can't find any recipes" />}
            <Pagination style={{ float: "right" }} value={activePage} onChange={handlePageChange} total={pages} />
        </Box>
    )
}

export default RecipeList
