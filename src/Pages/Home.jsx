import { useState, useEffect } from "react"
import axios from 'axios'
import util from '@aqualunae/util'
import { Link } from 'react-router-dom'
import Footer from "../Components/Footer"

const Home = () => {

    const [ charaList, setCharaList ] = useState([])
    const [ availableCharaList, setAvailableCharaList ] = useState([])
    const [ intro, setIntro ] = useState("")
    const [ availableOnly, setAvailableOnly ] = useState(false)
    const [ showRP, setShowRP ] = useState(false)

    useEffect(() => {
        (async() => {
            axios.get(`${ import.meta.env.VITE_API_URL }/charas/xiv`).then(res => {
                setCharaList(res.data)
                setAvailableCharaList(res.data.filter(chara => chara.roleplay == "open"))
            }).catch(err => {
                console.log(err)
            })
            axios.get(import.meta.env.VITE_INTRO_FILEPATH).then(res => {
                setIntro(res.data)
            }).catch(err => {
                console.log(err)
            })
        })()
    }, [])

    const displayList = charaList?.map(chara => {
        return (
            <Link className="card" to={ `/${ chara.firstName }` } >
                <img className="portrait bordered-img" src={ `/media/screens/xiv/icons/${ chara.firstName }.png` } />
                <div className="shape bordered box under-portrait"><h3>{ util.str.title(chara.firstName) } { util.str.title(chara.stageName) }</h3></div>
            </Link>
        )
    })

    const displayAvailable = availableCharaList?.map(chara => {
        return (
            <Link className="card" to={ `/${ chara.firstName }` } >
                <img className="portrait bordered-img" src={ `/media/screens/xiv/icons/${ chara.firstName }.png` } />
                <div className="shape bordered box under-portrait"><h3>{ util.str.title(chara.firstName) } { util.str.title(chara.stageName) }</h3></div>
            </Link>
        )
    })

    const toggleAvailable = () => {
        const changedToggle = !availableOnly
        setAvailableOnly(changedToggle)
    }

    const toggleRP = () => {
        const changedToggle = !showRP
        setShowRP(changedToggle)
    }

    return (
        <main className="main">
            <article>
                <div className="title shape bordered box"><h1>{ import.meta.env.VITE_USER }'s WoLs</h1></div>
                <div className="row wide">
                    <div className="half-col">
                        <a className="box shape bordered extra-margin" href="/screens">
                            <h2 className="center">Screencaps</h2>
                        </a>
                    </div>
                    <div className="half-col">
                        <a className="box shape bordered extra-margin" href="/cheat">
                            <h2 className="center">Timelines</h2>
                        </a>
                    </div>
                </div>
                <div className="bordered box wide spacer">
                    <h3 onClick={ toggleRP }>{ showRP ? "Hide RP Info" : "Show RP Info" }</h3>
                    { showRP && <p dangerouslySetInnerHTML={{ __html: intro }}></p> }
                </div>
                <div className="box shape bordered extra-margin" onClick={ toggleAvailable }>
                    <h2 className="center">{ availableOnly ? "Showing Available Only" : "Showing All Characters" }</h2>
                </div>
                <div className="row wide bordered transbox world">
                    { availableOnly ? displayAvailable : displayList }
                </div>
            </article>
            <Footer />
        </main>
    )
}

export default Home