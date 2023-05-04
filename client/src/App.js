import NavBar from './components_shared/navBars/NavBar';
import LandingPage from './components_shared/sidePages/LandingPage';
import Team from './components_shared/sidePages/teams/Team';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components_login/SignIn';
import SignUp from './components_login/SignUp';


import {
  StudentHome, Profiles,
  ViewProblem, ViewSpecficProblem,
  ViewBlog, ViewSpecficBlog,
  ViewEditorial, ViewSpecficEditorial,
  AddBlogs, AddProblems, AddEditorials,
  AdminHome
} from './routes/Routes';


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

        <Route path='/admin'>
          <Route index element={AdminHome} />
          <Route path='profile' element={Profiles} />
          <Route path='addBlog' element={AddBlogs} />
          <Route path='addProblem' element={AddProblems} />
          <Route path='addEditorial/:id' element={AddEditorials} />
        </Route>


        <Route path='/student'>
          <Route index element={StudentHome} />
          <Route path='profile' element={Profiles} />
        </Route>

        <Route path='/problem'>
          <Route index element={ViewProblem} />
          <Route path=':id' element={ViewSpecficProblem} />
        </Route>
        
        <Route path='/editorial'>
          <Route index element={ViewEditorial} />
          <Route path=':id' element={ViewSpecficEditorial} />
        </Route>
        
        <Route path='/blog'>
          <Route index element={ViewBlog} />
          <Route path=':id' element={ViewSpecficBlog} />
        </Route>
      </Routes>
    </>

  );
}

export default App;
