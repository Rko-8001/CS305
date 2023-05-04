import NavBar from './components_shared/navBars/NavBar';
import LandingPage from './components_shared/sidePages/LandingPage';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components_login/SignIn';
import SignUp from './components_login/SignUp';


import StudentRoute from './routes/StudentRoutes';
import {
  StudentHome, Profiles,
  ViewProblem, ViewSpecficProblem,
  ViewBlog, ViewSpecficBlog,
  ViewEditorial, ViewSpecficEditorial,
  AddBlogs, AddProblems, AddEditorials,
  AdminHome
} from './routes/Routes';
import AdminRoutes from './routes/AdminRoutes';

import ErrorPage from './components_shared/errorPages/ErrorPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />

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
          <Route index element={<AdminRoutes Component={AdminHome} />} />
          <Route path='profile' element={<AdminRoutes Component={Profiles} />} />
          <Route path='addBlog' element={<AdminRoutes Component={AddBlogs} />} />
          <Route path='addProblem' element={<AdminRoutes Component={AddProblems} />} />
          <Route path='addEditorial/:id' element={<AdminRoutes Component={AddEditorials} />} />
        </Route>


        <Route path='/student'>
          <Route index element={<StudentRoute Component={StudentHome} />} />
          <Route path='profile' element={<StudentRoute Component={Profiles} />} />
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

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>

  );
}

export default App;
