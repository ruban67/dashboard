import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SideNavbar.css";


export function SideNavbar({onClick, type}){

    const navigate = useNavigate();
    const [showNavBar, setNavBarVisibility] = useState(false);


    const handleMouseEnter = () => {
        setNavBarVisibility(true);
    }

    const handleMouseLeave = () => {
        setNavBarVisibility(false);
    }


    return(
        <div id="sideNavBar" className={showNavBar ? "navBarContainer" : "collapsedNavbar"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="sideNavbar">
                <div className="navBarItems">
                    <div className="dashboardWrapper" onClick={()=> onClick("/dashboard")}>
                        <img src={type === "course" ? "../Assets/dashboard.png": "./Assets/dashboard.png"}/>
                        <h3>Dashboard</h3>
                    </div>
                    <div className="coursesText" onClick={()=> onClick("/courses")}>
                        <img src={type === "course" ? "../Assets/courses.jpeg": "./Assets/courses.jpeg"}/>
                        <div>Courses</div>
                    </div>
                    <div className="coursesText" onClick={()=> onClick("/classes")}>
                        <img src={type === "course" ? "../Assets/classes.png": "./Assets/classes.png"}/>
                        <div>Classes</div>
                    </div>
                    <div className="coursesText" onClick={()=> onClick("/tasks")}>
                        <img src={type === "course" ? "../Assets/tasks.jpeg" : "./Assets/tasks.jpeg"}/>
                        <div>Tasks</div>
                    </div>
                </div>
                <div className="signOut" onClick={() => onClick("/login", "signOut")}>
                    <img src={type === "course" ? "../Assets/signout.png" : "./Assets/signout.png"}/>
                    <div>Sign Out</div>
                </div>
            </div>
        </div>
    );
}