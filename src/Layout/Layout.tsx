/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from 'react'


interface IProps {
}

const containerCss = css`
    margin:auto;
    width:900px;
    @media (max-width: 900px) {
        width: 100%;
    }
    // border: 1px solid red;
`

const layout: React.FC<IProps> = (props) => {
    return <div css={containerCss}>
        {props.children}
    </div>
}

export default layout
