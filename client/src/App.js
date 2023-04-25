import NavBar from './components/navBars/NavBar';
import LandingPage from './components/sidePages/LandingPage';
import Team from './components/sidePages/teams/Team';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components_login/SignIn';
import SignUp from './components_login/SignUp';
import MainPage from './components_student/MainPage';
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

        <Route path='/admin' element={
          <>
            <NavBar />
          </>
        } />

        <Route path='/student' element={
          <>
            <NavBar />
            <MainPage />
          </>
        } />
      </Routes>
    </>

  );
}

export default App;
