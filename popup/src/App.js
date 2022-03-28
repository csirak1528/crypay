import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Popup from './popup/Popup';
import Home from './components/Home/Home'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pay" element={<Popup />} />


            </Routes>
        </Router >);
}

export default App;