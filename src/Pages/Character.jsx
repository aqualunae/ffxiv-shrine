import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import util from '@aqualunae/util'
import Footer from '../Components/Footer'
import Error from './Error'
import ZoomImage from '../Components/ZoomImage'

const CharacterPage = () => {

    const { name } = useParams()

    const [ chara, setChara ] = useState()
    const [ caps, setCaps ] = useState([])
    const [ page, setPage ] = useState(0)
    const [ maxPage, setMaxPage ] = useState(0)
    const perPage = 10

    useEffect(() => {
        (async() => {
            axios.get(`${ import.meta.env.VITE_API_URL }/charas/xiv/${ name }`).then(res => {
                setChara(res.data)
            }).catch(err => {
                console.log(err)
            })
            axios.get(`${ import.meta.env.VITE_API_URL }/screencaps/xiv/chara/${ name }`).then(res => {
                setCaps(res.data.sort((a, b) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                }))
                setMaxPage(parseInt(res.data.length / perPage))
            }).catch(err => {
                console.log(err)
            })
        })()
    }, [])

    const getStat = (stat, trivia) => {
        const info = trivia ? chara.trivia[stat] : chara[stat]
        if (!info) { return }
        return (
            <><strong>{ util.str.unCamel(stat) }:</strong> { info }<br /></>
        )
    }

    const getList = (stat, trivia) => {
        const list = trivia ? chara.trivia[stat] : chara[stat]
        if (!list) { return }
        return (
            <>
                <strong>{ util.str.unCamel(stat) }:</strong><br />
                <ul>
                    { list.map(item => <li key={ item }>{ item }</li>) }
                </ul>
            </>
        )
    }

    const getImages = caps.slice(page * perPage, (page * perPage) + perPage).map((cap, index) => {
        return (
            <div className="box wide bordered spacer" key={ cap.filename }>
                <ZoomImage cap={ cap } index={ index } />
                <p>
                    <em className="screen-date">{ util.date.friendly(cap.date) }</em><br />
                    { cap.comment }
                </p>
            </div>
        )
    })

    const getOlder = (e) => {
        if (e.type === "click" || (e.type === "keyup" && e.key === "Enter")) {
            let newPage = page + 1
            if (newPage > maxPage) { newPage = page }
            setPage(newPage)
            window.scrollTo(0, 0)
            document.getElementById("page-img-0").focus()
        }
    }

    const getNewer = (e) => {
        if (e.type === "click" || (e.type === "keyup" && e.key === "Enter")) {
            let newPage = page - 1
            if (newPage < 0) { newPage = 0 }
            setPage(newPage)
            window.scrollTo(0, 0)
            document.getElementById("page-img-0").focus()
        }
    }

    return (
        chara ? <main className={ name.replace("'", "") } >
            <article>
                <div className="title shape bordered box"><h1>{ util.str.title(chara.firstName) } { util.str.title(chara.stageName) }</h1></div>
                <div className="row wide">
                    <div className="half-col">
                        <img className="full-portrait bordered-img" src={ `/media/screens/xiv/icons/${ chara.firstName }.png` } alt={ `An icon-scropped screencap of ${ chara.firstName }.` } />
                        <div className="box wide bordered spacer">
                            <h2>Quick Info</h2>
                            <p>
                                { getStat("pronouns", false) }
                                { getStat("height", false) }
                                { getStat("race", false) }
                                { getStat("clan", false) }
                                { getStat("color", true) }
                                { getStat("chocobo", true) }
                                { getList("job", false) }
                            </p>
                        </div>
                        <div className="box wide bordered spacer">
                            <h2>Details</h2>
                            <p>
                                { getList("physical", false) }
                                { getList("personality", false) }
                            </p>
                        </div>
                        { chara.bio && (
                            <div className="box wide bordered spacer">
                                <h2>About</h2>
                                <p>{ chara.bio }</p>
                            </div>
                        )}
                        { chara.history && (
                            <div className="box wide bordered spacer">
                                <h2>History</h2>
                                <p>{ chara.history }</p>
                            </div>
                        )}
                        { chara.rules && 
                            (<div className="box wide bordered spacer">
                                <h2>Meta</h2>
                                <p>
                                    { getList("rules", false) }
                                    { chara.knifeAUs && (
                                        <>
                                            <strong>AUs:</strong><br />
                                            <ul>
                                                { chara.knifeAUs.map(au => {
                                                    const auName = au.name ? au.name : chara.firstName
                                                    return <li key={ au.verseTag }><a href={ `${ import.meta.env.VITE_MAIN_SITE }/projects/${ au.verseTag }/charas/${ auName }` }>{ au.verseTag.toUpperCase() }</a></li>
                                                }) }
                                            </ul>
                                        </>
                                    )}
                                </p>
                            </div>)
                        }
                        { chara.retainers && (
                            <div className="box wide bordered spacer">
                                <h2>Retainers</h2>
                                { chara.retainers.map(ret => {
                                    return (
                                        <div key={ ret.name }>
                                            <h3 className="center">{ ret.name }</h3>
                                            <div className="center">
                                                <img className="retainer-portrait bordered" src={ `/media/screens/xiv/icons/r3_${ ret.name.toLowerCase() }.png` } />
                                            </div>
                                            <p>
                                                <em>{ ret.personality } { ret.race }</em><br />
                                                { ret.desc }
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        <a className="box shape bordered" href="/">
                            <h2 className="center">Return</h2>
                        </a>
                    </div>
                    <div className="half-col">
                        { getImages }
                        <div className="pagination">
                            { page !== maxPage && <div className="bordered box shape page-btn" tabIndex={ 0 } onClick={ (e) => getOlder(e) } onKeyUp={ (e) => getOlder(e) }><h3>Older</h3></div> }
                            { page > 0 && <div className="bordered box shape page-btn" tabIndex={ 0 } onClick={ (e) => getNewer(e) } onKeyUp={ (e) => getNewer(e) }><h3>Newer</h3></div> }
                        </div>
                    </div>
                </div>
            </article>
            <Footer />
        </main> : <main className="main"><Error err="not found" /></main>
    )
}

export default CharacterPage