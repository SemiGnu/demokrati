/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from 'react'
import {IParty} from './../Democracy'

interface IProps {
    party: IParty
}

const containerCss = css`
    width:100%;
    padding 5px;
    margin: 5px;
    box-shadow: 0 0 2px 2px rgba(0,0,50,0.2);
    // border: 1px solid #888;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
`
const pCss = css`
    font-weight: 700;
    text-align: center;
`
const dotBoxCss = css`
    width: 100%;
    height: 200px;
    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: flex-start;
    align-content: flex-start;
    align-items:center;
`

const party: React.FC<IProps> = (props) => {
    return <div css={containerCss}>
        <div css={dotBoxCss} >{new Array(props.party.mandates).fill(<Dot color={props.party.color} />)} </div>
        <p css={pCss} >{props.party.mandates}</p>
        <p css={pCss} >{props.party.shortName}</p>
    </div>
}

const dotCss = css `
    width: 10px;
    height: 10px;
    border-radius: 3px;
    margin: 2px;
    diplay:flex;
`

interface IDotProps {
    color: string
}

const Dot: React.FC<IDotProps> = props => {
    return <div style={{backgroundColor: props.color}} css={dotCss} ></div>
}

export default party
