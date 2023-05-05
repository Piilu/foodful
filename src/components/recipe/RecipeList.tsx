import React, { FunctionComponent, useEffect, useState } from 'react'
import Recipe from '../auth/Recipe'
import axios from 'axios';
import { EndPoint } from '~/constants/EndPoints';
import { RecipeReqListType, RecipeResListGetType } from '~/pages/api/recipe/list';
import { RecipeReqGetType } from '~/pages/api/recipe';
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { Recipe as RecipeBackType } from "@prisma/client";
import { Pagination } from '@mantine/core';
import { useScrollIntoView } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';

type RecipeListType = {
    limit: number;
    page: number;
    search?: boolean;
}

const RecipeList: FunctionComponent<RecipeListType> = (props) =>
{
    const [items, setItems] = useState<RecipeBackType[] | []>([]);
    const { limit, page, search } = props;
    const [pages, setPages] = useState<number>(1);
    const [activePage, setActivePage] = useState<number>(page);
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

    const getRecipes = async () =>
    {
        const data: RecipeReqListType = {
            page: activePage - 1,
            take: limit,
        }
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
        });
    };

    return (
        <>
            {search ?
                <InputGroup mb={5}>
                    <InputLeftElement
                        pointerEvents='none'
                        children={<IconSearch />}
                    />
                    <Input type='text' placeholder='Search by name' />
                </InputGroup> : null}
            <div ref={targetRef}></div>
            {items?.length !== 0 ? items.map((item) =>
            {
                return (
                    <Recipe key={item.id} name={item.name} horizontal guidelines="Testing guidlines" info={item.description} />
                )
            }) : <>NOT FOUND </>}
            <Pagination value={activePage} onChange={handlePageChange} total={pages} />
        </>
    )
}

export default RecipeList
