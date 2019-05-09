/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React from 'react'
import { dataset } from './../db'



interface IParty {
    name: string
    shortName: string
    color: string
    totalVotes: number
    votes: IRegionVotes[]
    mandates: number
}

interface IRegion {
    name: string
    mandates: number
}


interface IRegionVotes {
    region: string
    votes: number
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
        const parties: IParty[] = initParties.map(p => {
            let index = 0
            Object.keys(dataset.dimension.PolitParti.category.label).map((key) => {
                const labels: { [key: string]: any } = dataset.dimension.PolitParti.category.label
                const indices: { [key: string]: any } = dataset.dimension.PolitParti.category.index
                if (labels[key] === p.name) index = indices[key]
                return null
            })
            const votes = Object.keys(dataset.dimension.Region.category.label).map((key) => {
                const data: { [key: string]: any } = dataset.dimension.Region.category.label
                const vote = { region: data[key], votes: dataset.value[index] }
                index += initParties.length
                return vote
            })
            return { ...p, totalVotes: p.votes, votes: votes, mandates: 0}
        })
        this.state = {
            parties: parties,
            regions: intiRegions,
            divisor: 1.4,
            bar: .04,
        }
    }

    pCss = css`
        padding: 5px;
    `

    calculateDelegates = () => {
        const parties = [...this.state.parties]
        console.log(parties)
        this.state.regions.filter(r => r.name === "Oslo").map(region => {
            const votesPerParty = parties.map(party => {
                const votes = party.votes.find(v => v.region === region.name)
                return {party: party.name, votes: (votes ? votes.votes / this.state.divisor : 0), mandates: 0}
            })

            console.log(region.name, votesPerParty.sort(this.sortByVotes))
            let mostVotes = {party: "", votes: 0, mandates: 0}
            let biggestParty
            for (let i = 0; i < region.mandates + (this.state.bar === 0 ? 1 : 0); i++) {
                mostVotes = votesPerParty.reduce((acc, curr) => (curr.votes >= acc.votes ? curr : acc), mostVotes)
                biggestParty = parties.find(p => p.name === mostVotes.party)
                if (biggestParty) biggestParty.mandates ++
                mostVotes.votes = mostVotes.votes / (2*mostVotes.mandates + 1)
            }
            

            return null
        })
        return parties
    }

    sortByVotes = (a: any, b: any) => {
        return b.votes - a.votes
    }

    render() {
        this.calculateDelegates().map(p => {
            console.log(p.name, p.mandates)
            return null
        })
        // this.state.parties.map(p => console.log(p.totalVotes, p.votes.reduce((acc, curr) => acc + curr.votes, 0)))
        return this.state.parties.map((p, i) => <p key={i} css={this.pCss}>{p.name} {p.votes[0].votes} </p>)
    }
}

export default Democracy

const intiRegions = [
    { name: "Østfold", mandates: 8},
    { name: "Akershus", mandates: 16},
    { name: "Oslo", mandates: 18},
    { name: "Hedmark", mandates: 6},
    { name: "Oppland", mandates: 6},
    { name: "Buskerud", mandates: 8},
    { name: "Vestfold", mandates: 6},
    { name: "Telemark", mandates: 5},
    { name: "Aust-Agder", mandates: 3},
    { name: "Vest-Agder", mandates: 5},
    { name: "Rogaland", mandates: 13},
    { name: "Hordaland", mandates: 15},
    { name: "Sogn og Fjordane", mandates: 3},
    { name: "Møre og Romsdal", mandates: 8},
    { name: "Sør-Trøndelag (-2017)", mandates: 9},
    { name: "Nord-Trøndelag (-2017)", mandates: 4},
    { name: "Nordland", mandates: 8},
    { name: "Troms - Romsa", mandates: 5},
    { name: "Finnmark - Finnmárku", mandates: 4},
]

const initParties = [
    { name: 'Arbeiderpartiet', shortName: 'AP', votes: 800947, color: '#888' },
    { name: 'Høyre', shortName: 'H', votes: 732895, color: '#888' },
    { name: 'Fremskrittspartiet', shortName: 'FRP', votes: 444681, color: '#888' },
    { name: 'Senterpartiet', shortName: 'SP', votes: 302017, color: '#888' },
    { name: 'Sosialistisk Venstreparti', shortName: 'SV', votes: 176222, color: '#888' },
    { name: 'Venstre', shortName: 'V', votes: 127910, color: '#888' },
    { name: 'Kristelig Folkeparti', shortName: 'KRF', votes: 122797, color: '#888' },
    { name: 'Miljøpartiet De Grønne', shortName: 'MDG', votes: 94788, color: '#888' },
    { name: 'Rødt', shortName: 'R', votes: 70522, color: '#888' },
    { name: 'Pensjonistpartiet', shortName: 'PP', votes: 12855, color: '#888' },
    { name: 'Helsepartiet', shortName: 'HP', votes: 10337, color: '#888' },
    { name: 'Partiet De Kristne', shortName: 'PDK', votes: 8700, color: '#888' },
    { name: 'Liberalistene', shortName: 'L', votes: 5599, color: '#888' },
    { name: 'Demokratene i Norge', shortName: 'DN', votes: 3830, color: '#888' },
    { name: 'Piratpartiet', shortName: 'PIR', votes: 3356, color: '#888' },
    { name: 'Alliansen', shortName: 'A', votes: 3311, color: '#888' },
    { name: 'Kystpartiet', shortName: 'KP', votes: 2467, color: '#888' },
    { name: 'Nordmørslista', shortName: 'NML', votes: 2135, color: '#888' },
    { name: 'Feministisk Initiativ', shortName: 'FI', votes: 696, color: '#888' },
    { name: 'Norges Kommunistiske Parti', shortName: 'NKP', votes: 309, color: '#888' },
    { name: 'Norgespartiet', shortName: 'NP', votes: 151, color: '#888' },
    { name: 'Verdipartiet', shortName: 'VP', votes: 148, color: '#888' },
    { name: 'Samfunnspartiet', shortName: 'SAMF', votes: 104, color: '#888' },
    { name: 'Nordting', shortName: 'NT', votes: 59, color: '#888' },
]

