import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import util from '@aqualunae/util'
import Footer from '../Components/Footer'
import Error from './Error'
import ZoomImage from '../Components/ZoomImage'

const ScreenScroll = () => {

    const [ caps, setCaps ] = useState([])
    const [ page, setPage ] = useState(0)
    const [ maxPage, setMaxPage ] = useState(0)
    const perPage = 20

    useEffect(() => {
        (async() => {
            axios.get(`${ import.meta.env.VITE_API_URL }/screencaps/xiv`).then(res => {
                setCaps(res.data.sort((a, b) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                }))
                setMaxPage(parseInt(res.data.length / perPage))
            }).catch(err => {
                console.log(err)
            })
        })()
    }, [])

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
        <main className="main">
            <div className="col">
                <div className="title shape bordered box"><h1>Screencaps</h1></div>
                { getImages }
                <div className="pagination">
                    { page !== maxPage && <div className="bordered box shape page-btn" tabIndex={ 0 } onClick={ (e) => getOlder(e) } onKeyUp={ (e) => getOlder(e) }><h3>Older</h3></div> }
                    { page > 0 && <div className="bordered box shape page-btn" tabIndex={ 0 } onClick={ (e) => getNewer(e) } onKeyUp={ (e) => getNewer(e) }><h3>Newer</h3></div> }
                </div>
                <a className="box shape bordered extra-margin" href="/">
                    <h2 className="center">Return</h2>
                </a>
            </div>
            <Footer />
        </main>
    )
}

export default ScreenScroll