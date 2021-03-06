/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from 'react'
import { dataset } from './../db'
import Party from './Party/Party'



export interface IParty {
    index: number
    name: string
    shortName: string
    color: string
    shadow: string
    votes: number
    mandates: number
    checked: boolean
    leftness?: number
}

interface IRegion {
    index: number
    name: string
    mandates: number
    votes: {
        party: IParty
        votes: number
        mandates: number
    }[]
}

interface IProps {
}

interface IState {
    parties: IParty[]
    regions: IRegion[]
    divisor: number
    bar: number
}

class Democracy extends React.Component<IProps> {
    state: IState
    constructor(props: IProps) {
        super(props)

        const parties = this.loadParties()
        const regions = this.loadRegions(parties)
        const divisor = 1.4
        const bar = 0.04
        this.calculateDelegates(regions, divisor, bar)
        this.calculateLevellingMandates(regions, parties, divisor, bar)

        this.state = {
            parties: parties,
            regions: regions,
            divisor: divisor,
            bar: bar,
        }
    }

    CONTROL_MAX_HEIGHT = "186px"

    containerCss = css`
        background-color: #ebebeb;
        display: flex;
        flex-flow: column;
        
    `
    controlCss = css`
        max-height:${this.CONTROL_MAX_HEIGHT};
        position: fixed;
        background-color: #ebebeb;
        width: 100%;
        max-width:900px;
        bottom: 0;
    `
    xCss = css`
        margin: 0;
        padding: 10px;
        font-weight: 700;
        width: 20px;
    `
    testCss = css`
    display: flex;
        margin: 0;
        padding: 10px;
        font-weight: 700;
    `
    pCss = css`
        width: auto;
        margin: 0;
        padding: 10px;
        font-weight: 700;
        input {
            -webkit-appearance: none;
            width: 100%;
            height: 10px;
            border-radius: 5px;
            background: #808080;
            outline: none;
            -webkit-transition: .2s;
            transition: opacity .2s;
        }

        input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 12px;
            background: #4ea0ed;
            cursor: pointer;
          }
    `

    partiesCss = css`
        padding: 5px;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
    `

    toggleChecked = (index: number) => {
        const newParties = [...this.state.parties]
        const party = newParties.find(p => p.index === index)
        if (party) party.checked = !party.checked
        this.setState({parties: newParties}) 
    }

    uncheckAll = () => {
        const newParties = this.state.parties.map(p => ({...p, checked: false}))
        this.setState({parties: newParties}) 
    }

    partySort = (a: IParty, b: IParty) => {
        if (!a.leftness) return 1
        if (!b.leftness) return -1
        return a.leftness - b.leftness
    }

    render() {
        const parties = this.state.parties.filter(p => p.mandates > 0).sort(this.partySort).map((p, i) =>
            <Party key={i} party={p} clickHandler={() => this.toggleChecked(p.index)} />)
        let coalition = this.state.parties.filter(p => p.checked).sort(this.partySort).map(p => p.shortName).join(" + ")
        if (coalition.length > 0) {
            const totalCoalitionMandates = this.state.parties.filter(p => p.checked).reduce((acc, curr) => acc + curr.mandates, 0) 
            coalition += ": " + totalCoalitionMandates + "\t\t" + (totalCoalitionMandates > (169/2) ? "Flertall!" : "Ikke flertall")
        }


        return <div css={this.containerCss}>
            <div css={this.partiesCss} >
                {parties}
                <div style={{height: this.CONTROL_MAX_HEIGHT, width:'100%'}} ></div>
            </div>
            <div css={this.controlCss}>
                {coalition.length > 0 ? <div css={css`
                    display: flex;
                    justify-content: space-between;
                `}>
                    <p css={this.testCss}>
                        {coalition}
                    </p>
                    <p css={this.xCss} onClick={this.uncheckAll}>
                        X
                    </p>
                </div> : null}
                <p css={this.pCss}>
                    Sperregrense: {Math.round(this.state.bar * 100)}%<input type="range" min="0" max="12" value={this.state.bar * 100} onChange={this.barChangedHandler} />
                </p>
                <p css={this.pCss}>
                    Første delingstall: {this.state.divisor} <input type="range" min="0" max="10" value={Math.round((this.state.divisor - 1) * 10)} onChange={this.divisorChangedHandler} />
                </p>
            </div>
        </div>
    }

    loadParties(): IParty[] {
        const parties = Object.keys(dataset.dimension.PolitParti.category.label).map(key => {
            const labels: { [key: string]: string } = dataset.dimension.PolitParti.category.label
            const indices: { [key: string]: number } = dataset.dimension.PolitParti.category.index
            let party = initParties.find(p => p.name === labels[key])
            if (party) return { ...party, index: indices[key], shadow: getShadow(party.color, 0x40), checked: false }
            return { name: '', index: 0, votes: 0, mandates: 0, shortName: '', color: '', shadow: '', checked: false }
        })
        return parties
    }

    loadRegions(parties: IParty[]): IRegion[] {
        const regions = Object.keys(dataset.dimension.Region.category.label).map(key => {
            const labels: { [key: string]: string } = dataset.dimension.Region.category.label
            const indices: { [key: string]: number } = dataset.dimension.Region.category.index
            let region = initRegions.find(p => p.name === labels[key])
            if (region) return { ...region, index: indices[key], votes: [] }
            return { name: '', index: 0, mandates: 0, votes: [] }
        })
        this.loadVotes(regions, parties)
        return regions
    }

    loadVotes(regions: IRegion[], parties: IParty[]) {
        regions.forEach(r => {
            const votes = parties.map(p => {
                const party = p
                const votes = dataset.value[p.index + r.index * parties.length]
                return { party: party, votes: votes, mandates: 0 }
            })
            r.votes = votes
        })
    }

    calculateDelegates(regions: IRegion[], divisor: number, bar: number) {
        regions[0].votes.forEach(r => r.mandates = 0)
        regions.forEach(region => {
            region.votes = region.votes.map(v => { return { ...v, votes: v.votes / divisor } })
            for (let i = region.mandates; i > 0; i--) {
                region.votes = region.votes.sort((a, b) => this.sainteLagueSort(a, b, divisor))
                region.votes[0].mandates++
                region.votes[0].party.mandates++
            }
        })
    }

    calculateLevellingMandates(regions: IRegion[], parties: IParty[], divisor: number, bar: number) {
        let totalMandates = regions.reduce((acc, curr) => acc + curr.mandates, regions.length)
        const totalVotes = parties.reduce((acc, curr) => acc + curr.votes, 0)
        const eligibleParties = [...parties.filter(p => p.votes >= totalVotes * bar)]
        let validLevelling = false
        let testParties: { party: IParty, mandates: number }[] = []
        const testValid = (tp: any) => {
            if (tp.mandates - tp.party.mandates < 0) {
                eligibleParties.splice(eligibleParties.indexOf(tp.party), 1)
                validLevelling = false
            }
        }
        while (!validLevelling) {
            testParties = eligibleParties.map(ep => { return { party: ep, mandates: 0 } })
            totalMandates = eligibleParties.reduce((acc, curr) => acc + curr.mandates, regions.length)
            for (let i = totalMandates; i > 0; i--) {
                testParties = testParties.sort((a, b) => this.sainteLagueSort({ ...a.party, mandates: a.mandates }, { ...b.party, mandates: b.mandates }, divisor))
                if (testParties.length > 0) testParties[0].mandates++
            }
            validLevelling = true
            testParties.forEach(testValid)
        }
        testParties.forEach(tp => {
            tp.party.mandates = tp.mandates
        })
    }

    sainteLagueSort = (a: any, b: any, divisor: number) => {
        const left = (a.mandates === 0 ? a.votes / divisor : a.votes / (a.mandates * 2 + 1))
        const right = (b.mandates === 0 ? b.votes / divisor : b.votes / (b.mandates * 2 + 1))
        return right - left
    }

    barChangedHandler = (e: any) => {
        const newBar = e.target.value / 100
        const newParties = this.state.parties.map(p => ({...p, mandates: 0}))//this.loadParties()
        const newRegions = this.loadRegions(newParties)
        this.calculateDelegates(newRegions, this.state.divisor, newBar)
        this.calculateLevellingMandates(newRegions, newParties, this.state.divisor, newBar)
        this.setState({ parties: newParties, regions: newRegions, bar: newBar })
    }

    divisorChangedHandler = (e: any) => {
        const newDivisor = e.target.value / 10 + 1
        const newParties = this.state.parties.map(p => ({...p, mandates: 0}))//this.loadParties()
        const newRegions = this.loadRegions(newParties)
        this.calculateDelegates(newRegions, newDivisor, this.state.bar)
        this.calculateLevellingMandates(newRegions, newParties, newDivisor, this.state.bar)
        this.setState({ parties: newParties, regions: newRegions, divisor: newDivisor })
    }




}

export default Democracy

const initRegions = [
    { name: "Østfold", mandates: 8 },
    { name: "Akershus", mandates: 16 },
    { name: "Oslo", mandates: 18 },
    { name: "Hedmark", mandates: 6 },
    { name: "Oppland", mandates: 6 },
    { name: "Buskerud", mandates: 8 },
    { name: "Vestfold", mandates: 6 },
    { name: "Telemark", mandates: 5 },
    { name: "Aust-Agder", mandates: 3 },
    { name: "Vest-Agder", mandates: 5 },
    { name: "Rogaland", mandates: 13 },
    { name: "Hordaland", mandates: 15 },
    { name: "Sogn og Fjordane", mandates: 3 },
    { name: "Møre og Romsdal", mandates: 8 },
    { name: "Sør-Trøndelag", mandates: 9 },
    { name: "Nord-Trøndelag", mandates: 4 },
    { name: "Nordland", mandates: 8 },
    { name: "Troms", mandates: 5 },
    { name: "Finnmark", mandates: 4 },
]

const initParties = [
    { name: 'Arbeiderpartiet', shortName: 'AP', votes: 800947, mandates: 0, color: '#c10f0f', leftness: 70},
    { name: 'Høyre', shortName: 'H', votes: 732895, mandates: 0, color: '#1c74bc', leftness: 10 },
    { name: 'Fremskrittspartiet', shortName: 'FRP', votes: 444681, mandates: 0, color: '#0d4099', leftness: 1 },
    { name: 'Senterpartiet', shortName: 'SP', votes: 302017, mandates: 0, color: '#0c9e1b', leftness: 60 },
    { name: 'Sosialistisk Venstreparti', shortName: 'SV', votes: 176222, mandates: 0, color: '#ce0c46', leftness: 80 },
    { name: 'Venstre', shortName: 'V', votes: 127910, mandates: 0, color: '#04771b', leftness: 20 },
    { name: 'Kristelig Folkeparti', shortName: 'KRF', votes: 122797, mandates: 0, color: '#fce700', leftness: 30 },
    { name: 'Miljøpartiet De Grønne', shortName: 'MDG', votes: 94788, mandates: 0, color: '#1c9b06' },
    { name: 'Rødt', shortName: 'R', votes: 70522, mandates: 0, color: '#870000', leftness: 90 },
    { name: 'Pensjonistpartiet', shortName: 'PP', votes: 12855, mandates: 0, color: '#64bbea' },
    { name: 'Helsepartiet', shortName: 'HP', votes: 10337, mandates: 0, color: '#ff7d05' },
    { name: 'Partiet De Kristne', shortName: 'PDK', votes: 8700, mandates: 0, color: '#888' },
    { name: 'Liberalistene', shortName: 'L', votes: 5599, mandates: 0, color: '#888' },
    { name: 'Demokratene i Norge', shortName: 'DN', votes: 3830, mandates: 0, color: '#888' },
    { name: 'Piratpartiet', shortName: 'PIR', votes: 3356, mandates: 0, color: '#888' },
    { name: 'Alliansen', shortName: 'A', votes: 3311, mandates: 0, color: '#888' },
    { name: 'Kystpartiet', shortName: 'KP', votes: 2467, mandates: 0, color: '#888' },
    { name: 'Nordmørslista', shortName: 'NML', votes: 2135, mandates: 0, color: '#888' },
    { name: 'Feministisk Initiativ', shortName: 'FI', votes: 696, mandates: 0, color: '#888' },
    { name: 'Norges Kommunistiske Parti', shortName: 'NKP', votes: 309, mandates: 0, color: '#888' },
    { name: 'Norgespartiet', shortName: 'NP', votes: 151, mandates: 0, color: '#888' },
    { name: 'Verdipartiet', shortName: 'VP', votes: 148, mandates: 0, color: '#888' },
    { name: 'Samfunnspartiet', shortName: 'SAMF', votes: 104, mandates: 0, color: '#888' },
    { name: 'Nordting', shortName: 'NT', votes: 59, mandates: 0, color: '#888' },
]

const getShadow = (color: string, diff: number) => {
    const r = getDarker(color.slice(1, 3), diff)
    const g = getDarker(color.slice(3, 5), diff)
    const b = getDarker(color.slice(5, 7), diff)
    return "#" + r + g + b
}

const getDarker = (color: string, diff: number) => {
    let c = parseInt(color, 16) - diff
    if (c < 0) c = 0
    const t = c.toString(16)
    return t.length < 2 ? '0' + t : t
}
