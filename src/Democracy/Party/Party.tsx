/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from 'react'
import {IParty} from './../Democracy'

interface IProps {
    party: IParty
}

// const containerCss = css`
//     width:100%;
//     padding 5px;
//     margin: 5px;
//     box-shadow: 0 0 2px 1px rgba(0,0,50,0.2);
//     // border: 1px solid #888;
//     border-radius: 5px;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     align-items: center;
// `
// const pCss = css`
//     font-weight: 700;
//     text-align: center;
// `
// const dotBoxCss = css`
//     width: 80px;
//     height: 200px;
//     display: flex;
//     flex-wrap: wrap-reverse;
//     justify-content: flex-start;
//     align-content: flex-start;
//     align-items:center;
// `
const containerCss = css`
    height:100%;
    padding 5px;
    margin: 5px;
    box-shadow: 0 0 2px 1px rgba(0,0,50,0.2);
    // border: 1px solid #888;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-base:100%;
    align-items: center;
    background-color: white;
`
const pCss = css`
    font-weight: 700;
    text-align: center;
    flex-grow:1;
    flex-basis:10%;
`
const dotBoxCss = css`
    width: 100%;
    height: 80px;
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items:center;
    flex-grow:8;
    flex-basis:100%;
`

const party: React.FC<IProps> = (props) => {
    return <div css={containerCss}>
        <p css={pCss} >{props.party.shortName}</p>
        <p css={pCss} >{props.party.mandates}</p>
        <div css={dotBoxCss} >{new Array(props.party.mandates).fill(null).map((dot, i) => <Dot color={props.party.color} shadow={props.party.shadow} key={i} /> )} </div>
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
    shadow: string
}

const Dot: React.FC<IDotProps> = props => {
    return <div style={{backgroundColor: props.color, border: "1px solid " + props.shadow}} css={dotCss} ></div>
}



export default party
