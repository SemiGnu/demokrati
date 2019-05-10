/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from 'react'
import {IParty} from './../Democracy'

interface IProps {
    party: IParty
}

const containerCss = css`
    width:100px;
    padding 5px;
    marigin: 5px;
    box-shadow: 0 0 2px 2px rgba(0,0,0,0.5);
    // border: 1px solid #888;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
`
const pCss = css`
    font-weight: 700;
    text-align: center;
`

const party: React.FC<IProps> = (props) => {
    return <div css={containerCss}>
        <p css={pCss} >{props.party.mandates}</p>
        <p css={pCss} >{props.party.shortName}</p>
    </div>
}

export default party
