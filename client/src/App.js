import NavBar from './components_shared/navBars/NavBar';
import LandingPage from './components_shared/sidePages/LandingPage';
import Team from './components_shared/sidePages/teams/Team';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components_login/SignIn';
import SignUp from './components_login/SignUp';
import MainPage from './components_student/MainPage';
import Profile from './components_shared/profile/Profile';
import ViewProblems from './components_problem/problemPage/ViewProblems';
import ViewAProblem from '../src/components_problem/problemPage/ViewAProblem';


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

        <Route path='/student'>
          <Route index
            element={
              <>
                <NavBar />
                <MainPage />
              </>
            } />

          <Route path='profile'
            element={
              <>
                <NavBar />
                <Profile />
              </>
            } />

        </Route>

        <Route path='/problem'>
          <Route index
            element={
              <>
                <NavBar />
                <ViewProblems />
              </>
            }
          />
          <Route path=':id' element={<>
            <NavBar />
            <ViewAProblem />
          </>} />
        </Route>
      </Routes>
    </>

  );
}

export default App;
