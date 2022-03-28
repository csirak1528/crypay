import "../styles/Menu.css"
import React, { useState } from "react"
import axios from "axios"

import {
    RedditIcon,
    RedditShareButton,
    TwitterIcon,
    TwitterShareButton,
    TelegramIcon,
    TelegramShareButton,




} from "react-share";
const config = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
};

const base = "http://localhost:3001"
const shareUrl = "Check out CryPay: http://localhost:3000.\n\nIt lets you pay with crypto on sites like Amazon or eBay"
const title = "Crypay: Crypto in the real world"
const iconSize = 32;

const Menu = ({ viewMode, setViewMode }) => {
    const [mode, setMode] = useState("")
    const [report, setReport] = useState("")

    const modeSwitch = () => {
        switch (mode) {
            case "report":
                return modeReport()
            case "share":
                return modeShare()
            default:
                return mainMenu()
        }
    }

    const submitReport = async () => {
        if (report) {
            axios({
                method: 'post',
                url: `${base}/feedback`,
                data: {
                    feedback: report
                },
                headers: config.headers
            })
            alert("Thanks for helping us improve the platform")
            setReport("")
            setMode("")
        }
    }

    const mainMenu = () => {
        return (
            <div>
                <div className="row-menu" >
                    <h3 className="exit clickable" onClick={() => { setViewMode("main") }}>Exit</h3>
                    <h1 className="header">Menu</h1>
                </div>
                <div className="list-items">
                    <div className="list-item-menu" onClick={() => { setMode("share") }} >
                        <h4>Share to friends</h4>
                    </div>
                    <div className="list-item-menu" onClick={() => { setMode("report") }} >
                        <h4>Feedback/Requests</h4>
                    </div>
                </div>
            </div>
        )
    }

    const modeShare = () => {
        return (
            <div>
                <div className="row-menu" >
                    <h4 className="exit clickable" onClick={() => { setMode("") }}>Back</h4>
                    <h3 className="header">Share To Friends</h3>
                </div>
                <div>
                    <div className="shareable-icons">
                        <div className="shareable">
                            <h3>Reddit</h3>
                            <RedditShareButton url={shareUrl} title={title}>
                                <RedditIcon size={iconSize} round />
                            </RedditShareButton>
                        </div>
                        <div className="shareable">
                            <h3>Twitter</h3>
                            <TwitterShareButton url={"\n\n" + shareUrl} title={title}>
                                <TwitterIcon size={iconSize} round />
                            </TwitterShareButton>
                        </div>
                        <div className="shareable">
                            <h3>Telegram</h3>
                            <TelegramShareButton url={"\n\n" + shareUrl} title={title}>
                                <TelegramIcon size={iconSize} round />
                            </TelegramShareButton>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modeReport = () => {
        return (
            <div>

                <div className="row-menu" >
                    <h4 className="exit clickable" onClick={() => { setMode("") }}>Back</h4>
                    <h3 className="header">Feedback</h3>
                </div>
                <div>

                    <div className="report-wrapper"
                    ><textarea onChange={({ target }) => { setReport(target.value) }} value={report} className="report-box" rows="14" placeholder="Click Here" /></div>
                    <div className="selection-button" onClick={submitReport}>Submit</div>

                </div>

            </div>)
    }

    return (
        <div className={viewMode == "menu" ? "menu-view" : "hide-menu"}>
            {modeSwitch()}
        </div>
    );
}

export default Menu;