import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../global";
import { CourseBarChart } from "./CourseBarChart";
import { PieRechartComponent } from "./CoursePieChart";


import "./dashboard.css";
import { DashboardCard } from "./Cards";

export function Dashboard(){

    const [userCourseDetails, setUserCourseDetails] = useState([]);
    const [userTaskDetails, setUserTaskDetails] = useState([]);
    const [dashboardCount , setDashboardCount] = useState({});
    const [courseStatus , setCourseStatus] = useState([]);

    let userDetails = localStorage.getItem("user");
    userDetails = userDetails && JSON.parse(userDetails);
    const userId = userDetails.userId;
    const userName = userDetails.userName;
    const token = userDetails.token;


    useEffect(()=>{
        getUserCourseDetails();
        getUserTaskDetails();
        getAllCount();
    },[])

    async function getUserCourseDetails(){
        const courseDetails = await fetch(`${API}/courses/userCourses/${userId}`,{
            headers: {"x-auth-token" : token }
        }).then((data)=>data.json());
        console.log("courseDetails",courseDetails);
        consolidateCourseStatus(courseDetails);
        setUserCourseDetails(courseDetails);
        console.log(dashboardCount);
    }

    async function getUserTaskDetails(){
        const taskDetails = await fetch(`${API}/tasks/userTasks/${userId}`,{
            headers: {"x-auth-token" : token }
        }).then((data)=>data.json());
        const allTaskDetails = await fetch(`${API}/tasks/getAllTasks`,{
            headers: {"x-auth-token" : token }
        }).then((data)=>data.json());
        const taskStatus = [{status : "Completed", count : taskDetails.length},{status : "Not Started", count : allTaskDetails.length-taskDetails.length}];
        setUserTaskDetails(taskStatus);
        console.log("taskStatus",taskStatus);
    }

    async function getAllCount(){
        const count = await fetch(`${API}/count/getAllCount`,{
            headers: {"x-auth-token" : token }
        }).then((data)=>data.json());
        console.log("count",count);
        setDashboardCount(count);
    }
    

    function consolidateCourseStatus(courseDetails){

        // let status = {completed : 0, inProgress : 0, notStarted : 0};
        let dashBoardStatus = [{status: 'Completed', count : 0}, {status: "In Progress", count : 0}, {status: "Not Started", count : 0}]

        for(var i=0; i<courseDetails.length; i++){
            if(courseDetails[i].percentageCompletion === 0){
                dashBoardStatus[2]["count"] = dashBoardStatus[2]["count"] + 1;
            } else if(courseDetails[i].percentageCompletion === 100){
                dashBoardStatus[0]["count"] = dashBoardStatus[0]["count"] + 1;
            } else{
                dashBoardStatus[1]["count"] = dashBoardStatus[1]["count"] + 1;
            }
        };

        console.log("dashBoardStatus",dashBoardStatus);
        setCourseStatus(dashBoardStatus);
    }

    

    return localStorage.getItem("user") ? (
        <div className='dashBoardContainer'>
            <DashboardCard dashboardCount={dashboardCount}/>
            <div className="courseStatusCharts">
                <h2>Course Completion Status</h2>
                <div className='courseChartWrapper'>
                    <CourseBarChart userCourseDetails={userCourseDetails} />
                    {courseStatus && <PieRechartComponent userTaskDetails={courseStatus}/>}
                </div>
            </div>
                <div className="taskChartWrapper">
                <h2>Task Completion Status</h2>
                <PieRechartComponent userTaskDetails = {userTaskDetails} type="task"/>
            </div>
        </div>
    ) :
    (
        <Navigate to ="/login" />
    );
}