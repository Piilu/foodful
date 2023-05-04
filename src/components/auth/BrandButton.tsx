import React, { FunctionComponent } from 'react'
import { Brands } from '~/constants/types';

type BrandButtonType = {
    name: string,
}
const BrandButton: FunctionComponent<BrandButtonType> = (props) =>
{
    const { name } = props;
    return (
        <div>

        </div>
    )
}

export default BrandButton
