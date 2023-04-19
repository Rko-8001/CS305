import NavBar from './components/navBars/NavBar';
import LandingPage from './components/sidePages/LandingPage';
import Team from './components/sidePages/teams/Team';
import { Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/meetTheTeam'
          element={
            <>
              <NavBar />
              <Team />
            </>
          } />

      </Routes>
    </>
  );
}

export default App;
