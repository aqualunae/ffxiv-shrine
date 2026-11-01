import { useState, useEffect } from "react"

const ZoomImage = ({ cap, index }) => {

    const [ open, setOpen ] = useState(false)

    const clickHandler = () => {
        const newOpen = open ? false : true
        setOpen(newOpen)
    }

    const keyboardHandler = (event) => {
        if (event.code === "Enter") {
            clickHandler()
        } else if (event.code === "Tab") {
            setOpen(false)
        }
    }

    const [ warnings, setWarnings ] = useState(cap.warnings ? "absolute" : "none")
    const warningClick = (event) => {
        setWarnings("none")
    }

    const warningKey = (event) => {
        if (event.code === "Enter") {
            event.target.nextSibling.focus()
            setWarnings("none")
        }
    }

    useEffect(() => {
        if (open) {
            document.getElementById(cap.filename).focus()
        }
    }, [ open ])

    return (
        <div className="screen-wrapper">
            { open && <div className="overlay">
                <img 
                    className="screencap" 
                    src={ `/media/screens/xiv/${ cap.filename }.${ cap.filetype ? cap.filetype : "png" }` } 
                    alt={ cap.alt_text } 
                    id={ cap.filename }
                    tabIndex={ 0 }
                    onClick={ clickHandler }
                    onKeyUp={ keyboardHandler }
                />
            </div> }
            { cap.warnings && <div 
                className="screen-warnings" 
                onClick={ warningClick } 
                onKeyUp={ warningKey } 
                tabIndex={ 0 }
                style={{ display: warnings }}
                id={ `page-img-${ index }` }
            >
                <p>{ cap.warnings.join(", ") }</p>
            </div> }
            <img 
                className="screen-thumb" 
                src={ `/media/screens/xiv/${ cap.filename }.${ cap.filetype ? cap.filetype : "png" }` } 
                alt={ cap.alt_text } 
                tabIndex={ cap.warnings ? -1 : 0 }
                onClick={ clickHandler }
                onKeyUp={ keyboardHandler }
                id={ warnings === "none" ? `page-img-${ index }` : `page-bg-${ index }` }
            />
        </div>
    )
}

export default ZoomImage