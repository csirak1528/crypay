import "../styles/Settings.css"
const Settings = ({ viewMode, setViewMode }) => {
    return (
        <div className={viewMode == "settings" ? "settings-view" : "hide-menu"}>
            <div className="row-menu shift-left">
                <h1 className="header">Settings</h1>
                <h3 className="exit clickable" onClick={() => { setViewMode("main") }}>Exit</h3>
            </div>
            <div className="list-items">
                <div className="list-item-settings" >
                    <h4>Defaults</h4>
                </div>
            </div>
        </div >);
}

export default Settings;