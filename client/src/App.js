import NavBar from './components/navBars/NavBar';
import LandingPage from './components/sidePages/LandingPage';
import Team from './components/sidePages/teams/Team';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components_login/SignIn';
import SignUp from './components_login/SignUp';
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
        <Route path='/signin'
          element={
            <>
              <NavBar />
              <SignIn />
            </>
          } />

        <Route path='/signup'
          element={
            <>
              <NavBar />
              <SignUp />
            </>
          } />
      </Routes>
    </>
  );
}

export default App;
