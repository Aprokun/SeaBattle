import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GamePage from "./pages/GamePage";
import Login from "./pages/Login";

function App() {
    return (
        <div className={'App'}>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Login/>}/>
                    <Route path={'/game'}>
                        <Route path={':gameId'} element={<GamePage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App
