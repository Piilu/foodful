import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import Recipe from '../auth/Recipe'
import axios from 'axios';
import { EndPoint } from '~/constants/EndPoints';
import { RecipeReqListType, RecipeResListGetType } from '~/pages/api/recipe/list';
import { RecipeReqGetType } from '~/pages/api/recipe';
import { InputGroup, InputLeftElement, Input, Text, Checkbox } from "@chakra-ui/react";
import { Recipe as RecipeBackType } from "@prisma/client";
import { Group, Pagination } from '@mantine/core';
import { useScrollIntoView, useDebouncedState } from '@mantine/hooks';
import { Loader } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';

type RecipeListType = {
    limit: number;
    page: number;
    search?: boolean;
    userId?: string;
    showUpperPagination?: boolean;
    showFavorites?: boolean;
}

const RecipeList: FunctionComponent<RecipeListType> = (props) =>
{
    const [items, setItems] = useState<RecipeBackType[] | []>([]);
    const { limit, page, search, userId, showUpperPagination, showFavorites } = props;
    const [pages, setPages] = useState<number>(1);
    const [activePage, setActivePage] = useState<number>(page);
    const [value, setValue] = useDebouncedState<string | undefined>(undefined, 300)
    const [loading, setLoading] = useState<boolean>(true);
    const [favorite, setFavorite] = useState<boolean>(false);
    const router = useRouter();
    const checkRef = useRef<React.LegacyRef<HTMLInputElement> | undefined>();
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 60,
    });

    const handlePageChange = (page: number) =>
    {
        setActivePage(page);
        scrollIntoView({
            alignment: 'center',
        })
    }
    useEffect(() =>
    {
        if (showFavorites)
        {
            router.push({ query: { ...router.query, favorite: checkRef.current.checked } }, undefined, { shallow: true, });
        }
        getRecipes();
    }, [activePage, favorite]);
    useEffect(() =>
    {
        if (value !== undefined)
        {
            getRecipes();
        }
    }, [value]);

    const getRecipes = async () =>
    {
        const data: RecipeReqListType = {
            page: activePage - 1,
            take: limit,
            searchName: value,
            userId: userId,
            favorite: showFavorites ? checkRef.current?.checked : false,
        }
        setLoading(true);
        await axios.post(`${window.origin}/${EndPoint.RECIPELIST}`, data).then((res) =>
        {
            const newData = res.data as RecipeResListGetType;

            if (newData.success)
            {
                setItems(newData.recipes);
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
        <>

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
                    <Recipe key={item.id} horizontal recipe={item} userId={item.userId} />
                )
            }) : <Text align={"center"}> Not found</Text>}
            <Pagination style={{ float: "right" }} mb={10} value={activePage} onChange={handlePageChange} total={pages} />
        </>
    )
}

export default RecipeList
