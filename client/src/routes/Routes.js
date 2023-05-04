import NavBar from "../components_shared/navBars/NavBar";
import Profile from "../components_shared/profile/Profile";
import ViewProblems from "../components_problem/problemPage/ViewProblems";
import ViewAProblem from "../components_problem/problemPage/ViewAProblem";
import ViewBlogs from "../components_blog/ViewBlogs";
import ViewABlog from "../components_blog/ViewABlog";
import ViewEditorials from "../components_blog/ViewEditorials";
import ViewAEditorial from "../components_blog/ViewAEditorial";
import AddBlog from "../components_admin/addContent/blogs/AddBlog";
import AddProblem from "../components_admin/addContent/problems/AddProblem";
import AddEditorial from "../components_admin/addContent/editorial/AddEditorial";

export const StudentHome =
    <>
        <NavBar />
        <Profile />
    </>

export const Profiles =
    <>
        <NavBar />
        <Profile />
    </>

export const ViewProblem =
    <>
        <NavBar />
        <ViewProblems />
    </>

export const ViewSpecficProblem =
    <>
        <NavBar />
        <ViewAProblem />
    </>

export const ViewBlog =
    <>
        <NavBar />
        <ViewBlogs />
    </>

export const ViewSpecficBlog =
    <>
        <NavBar />
        <ViewABlog />
    </>


export const ViewEditorial =
    <>
        <NavBar />
        <ViewEditorials />
    </>

export const ViewSpecficEditorial =
    <>
        <NavBar />
        <ViewAEditorial />
    </>


export const AddBlogs =
    <>
        <NavBar />
        <AddBlog />
    </>

export const AddProblems =
    <>
        <NavBar />
        <AddProblem />
    </>

export const AddEditorials =
    <>
        <NavBar />
        <AddEditorial />
    </>


export const AdminHome =
    <>
        <NavBar />
        <Profile />
    </>
