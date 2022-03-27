import "../styles/Menu.css"
import React, { useState } from "react"
import axios from "axios"

const config = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
};

const base = "http://localhost:3001"


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
            (await axios({
                method: 'post',
                url: `${base}/reports`,
                data: {
                    report: report
                },
                headers: config.headers
            }))
            alert("Thanks for helping us improve the platform")
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