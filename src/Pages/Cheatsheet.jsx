import { useState, useEffect } from "react"
import axios from 'axios'
import util from '@aqualunae/util'
import { Link } from 'react-router-dom'
import Footer from "../Components/Footer"

const Cheatsheet = () => {

    const [ charaList, setCharaList ] = useState([])
    const [ worldList, setWorldList ] = useState([])
    const [ timelineList, setTimelineList ] = useState([])
    const [ displayGroups, setDisplayGroups ] = useState([])
    const [ displayMode, setDisplayMode ] = useState("timeline")

    useEffect(() => {
        (async() => {
            axios.get(`${ import.meta.env.VITE_API_URL }/charas/xiv`).then(res => {
                console.log(res.data)
                setCharaList(res.data)
                const worlds = res.data?.reduce((list, chara) => {
                    if (chara?.trivia?.world && !list.includes(chara.trivia.world)) {
                        list.push(chara.trivia.world)
                    }
                    return list
                }, [])
                setWorldList(worlds)

                const timelines = res.data?.reduce((list, chara) => {
                    if (chara?.trivia?.timeline && !list.includes(chara.trivia.timeline)) {
                        list.push(chara.trivia.timeline)
                    }
                    return list
                }, [])
                setTimelineList(timelines)
            }).catch(err => {
                console.log(err)
            })
        })()
    }, [])

    useEffect(() => {
        const timelines = timelineList?.sort((a, b) => b.localeCompare(a)).map(timeline => {
            const groupCharacters = charaList?.filter(chara => {
                return chara.trivia?.timeline === timeline
            }).map(chara => {
                return (
                    <Link className="card" to={ `/${ chara.firstName }` } >
                        <img className="portrait bordered-img" src={ `/media/screens/xiv/icons/${ chara.firstName }.png` } />
                        <div className="shape bordered box under-portrait"><h3>{ util.str.title(chara.firstName) } { util.str.title(chara.stageName) }</h3></div>
                    </Link>
                )
            })
            return (
                <div className="row wide bordered transbox world">
                    <div className="shape bordered box world-title"><h2>{ util.str.title(timeline) + ' Timeline' }</h2></div>
                    { groupCharacters }
                </div>
            )
        })
        const worlds = worldList?.map(world => {
            const groupCharacters = charaList?.filter(chara => {
                return chara.trivia?.world === world
            }).map(chara => {
                return (
                    <Link className="card" to={ `/${ chara.firstName }` } >
                        <img className="portrait bordered-img" src={ `/media/screens/xiv/icons/${ chara.firstName }.png` } />
                        <div className="shape bordered box under-portrait"><h3>{ util.str.title(chara.firstName) } { util.str.title(chara.lastName) }</h3></div>
                    </Link>
                )
            })
            return (
                <div className="row wide bordered transbox world">
                    <div className="shape bordered box world-title"><h2>{ `World: ${util.str.title(world)}` }</h2></div>
                    { groupCharacters }
                </div>
            )
        })

        let groups = displayMode == "timeline" ? timelines : worlds
        setDisplayGroups(groups)
    }, [ charaList, worldList, timelineList, displayMode ])

    const toggleDisplayMode = () => {
        let mode = displayMode == "timeline" ? "world" : "timeline"
        setDisplayMode(mode)
    }

    return (
        <main className="main">
            <article id="cheat">
                <div className="title shape bordered box"><h1>Knife's WoLs</h1></div>
                <div className="box shape bordered" onClick={ toggleDisplayMode }>
                    <h2 className="center">{ `Displaying by ${ displayMode }` }</h2>
                </div>
                { displayGroups }
                <a className="box shape bordered extra-margin" href="/">
                    <h2 className="center">Return</h2>
                </a>
            </article>
            <Footer />
        </main>
    )
}

export default Cheatsheet