import React, { FunctionComponent, useEffect, useState } from 'react'
import Recipe from '../auth/Recipe'
import axios from 'axios';
import { EndPoint } from '~/constants/EndPoints';
import { RecipeReqListType, RecipeResListGetType } from '~/pages/api/recipe/list';
import { RecipeReqGetType } from '~/pages/api/recipe';
import { InputGroup, InputLeftElement, Input, Text } from "@chakra-ui/react";
import { Recipe as RecipeBackType } from "@prisma/client";
import { Pagination } from '@mantine/core';
import { useScrollIntoView, useDebouncedState } from '@mantine/hooks';
import { Loader } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

type RecipeListType = {
    limit: number;
    page: number;
    search?: boolean;
    userId?: string;
    showUpperPagination?: boolean;
}

const RecipeList: FunctionComponent<RecipeListType> = (props) =>
{
    const [items, setItems] = useState<RecipeBackType[] | []>([]);
    const { limit, page, search, userId, showUpperPagination } = props;
    const [pages, setPages] = useState<number>(1);
    const [activePage, setActivePage] = useState<number>(page);
    const [value, setValue] = useDebouncedState<string | undefined>(undefined, 300)
    const [loading, setLoading] = useState<boolean>(true);
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
    useEffect(() => { getRecipes() }, [activePage]);
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
            {showUpperPagination ?
                <Pagination w={"100%"} mb={10} value={activePage} onChange={handlePageChange} total={pages} />
                : null}
            <div ref={targetRef}></div>
            {loading ? <Loader mb={10} color='green' mx={"auto"} /> : null}
            {items?.length !== 0 ? items.map((item) =>
            {
                return (
                    <Recipe key={item.id} name={item.name} horizontal guidelines="Testing guidlines" info={item.description} userId={item.userId} />
                )
            }) : <Text align={"center"}> Not found</Text>}
            <Pagination style={{ float: "right" }} mb={10} value={activePage} onChange={handlePageChange} total={pages} />
        </>
    )
}

export default RecipeList
