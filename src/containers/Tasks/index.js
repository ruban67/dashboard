import { Button, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API } from "../../global";
import { SideNavbar } from "../SideNavbar";

import "./Tasks.css";

export function Tasks(){

    const [allTasksData, setAllTasksData] = useState([]);
    const [taskData,setTaskData] = useState({});


    let userDetails = localStorage.getItem("user");
    userDetails = userDetails && JSON.parse(userDetails);
    const token = userDetails && userDetails.token;


    useEffect(()=>{
        getAllTasks();
    },[]);

    async function getAllTasks(){
        const data = await fetch(`${API}/tasks/getAllTasks`,{
            headers: {"x-auth-token" : token }
        }).then((data)=>data.json());
        console.log("get all tasks===", data);
        setAllTasksData(data);
    }

    const taskExpand = (value)=>{
        console.log("taksexpand", value);
        setTaskData(value);
    }

    return localStorage.getItem("user") ? (
        <div className="tasksContainer">
            <div className = "tasksContentWrapper">
                {Object.keys(taskData).length ?
                    <TaskInfo taskData = {taskData}/> :
                    <div className="initalTaskHeader">
                        <h2>Click on Tasks to get Info</h2>
                        <img src="https://th.bing.com/th/id/R.dc60f6f1f3e6799945240e7b4bee248b?rik=Ln%2f20RDVYMDb6g&riu=http%3a%2f%2fwww.freeiconspng.com%2fuploads%2fright-arrow-png-31.png&ehk=TCjsCOW5%2bkyH8hFxGp3ho2LO7t0jnsHVNN8Nnjt182A%3d&risl=&pid=ImgRaw&r=0"/>
                    </div>
                }
                </div>
            <div className="taskInfoContainer">
                <h2>Tasks</h2>
                <div className = "tasksInfoWrapper">
                    {allTasksData.map((value,index)=>{
                        return <Button key = {value._id} onClick = {()=>taskExpand(value)}>{value.taskName}</Button>
                    })}
                </div>
            </div>
        </div>
    ) : 
    (
        <Navigate to ="/login" />
    );
}


export function TaskInfo({taskData}){
   
   const [frontEndSourceURL, setFrontEndSourceURL] = useState("");
   const [frontEndDeploymentURL, setFrontEndDeploymentURL] = useState("");
   const [backEndSourceURL, setBackEndSourceURL] = useState("");
   const [backEndDeploymentURL, setBackEndDeploymentURL] = useState("");
   const [userTask, updateUserTask] = useState({});

    let userDetails = localStorage.getItem("user");
    userDetails = userDetails && JSON.parse(userDetails);
    const userName = userDetails.userName;
    const userId = userDetails.userId;
    const token = userDetails.token;

    useEffect(() => {
        getUserTasks();
        setFrontEndSourceURL("");
        setFrontEndDeploymentURL("");
        setBackEndSourceURL("");
        setBackEndDeploymentURL("");
    }, [taskData]);

   const onFrontEndSourceChange = (e)=>{
    setFrontEndSourceURL(e.target.value);
   }

   const onFrontEndDeploymentURLChange = (e)=>{
    setFrontEndDeploymentURL(e.target.value);
   }

   const onBackEndSourceChange = (e)=>{
    setBackEndSourceURL(e.target.value);
   }

   const onBackEndDeploymentURLChange = (e)=>{
    setBackEndDeploymentURL(e.target.value);
   }

   async function updateTaskStatus(data){
        try{
            const result = await fetch(`${API}/tasks/postTaskSolutions/${taskData.taskName}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {"content-type": "application/json", "x-auth-token" : token}
            });
            getUserTasks();
        }catch(error){
            console.log("Error in API for updation of task status - ",error )
        }
    }

    async function getUserTasks(){
        try{
            const userTasks = await fetch(`${API}/tasks/userTasks/${userId}`,{
                headers: {"x-auth-token" : token }
            }).then((data)=>data.json());
            const currentUserTask = userTasks.filter((value) => {
                return value.taskName === taskData.taskName;
           });
           console.log("get user tasks====", userTasks, currentUserTask);
            updateUserTask(currentUserTask);
        }catch(error){
            console.log("Error in API for updation of task status - ",error )
        }
    }

   const onSubmit = async (e)=>{
        e.preventDefault();
        var data = {
            frontEndSourceURL: frontEndSourceURL,
            frontEndDeployedURL: frontEndDeploymentURL,
            backEndSourceURL: backEndSourceURL,
            backEndDeployedURL: backEndDeploymentURL,
            userName : userName
        };
        console.log(data);
        updateTaskStatus(data);
   }

   
   
    return (
        <Card className = "taskCard">
            <div className="taskHeader">
                <h2>Task Description</h2>
                {userTask.length ? <div className="taskStatus">Submitted</div> : ""}
            </div>
            <div className ="taskDescription">{taskData.taskInfo}</div>
           <form className = "taskSubmissionForm" onSubmit = {(e)=>onSubmit(e)}>
                <div className={userTask.length ? "readOnlyInput" : ""}>
                    <label htmlFor = "frontEndSourceURL">Front End Source Code URL:</label> <br/>
                    <input id = "frontEndSourceURL" type = "text" onChange = {(e)=>onFrontEndSourceChange(e)} required
                        readOnly={userTask.length} value={userTask.length ? userTask[0].frontEndSourceURL : frontEndSourceURL} />
                </div>
                <div className={userTask.length ? "readOnlyInput" : ""}>
                    <label htmlFor = "frontEnddeployedURL">Front End Deployment URL:</label><br/>
                    <input id = "frontEnddeployedURL" type = "text" onChange = {(e)=>onFrontEndDeploymentURLChange(e)} required
                        readOnly={userTask.length} value={userTask.length ? userTask[0].frontEndDeployedURL : frontEndDeploymentURL}/>
                </div>
                <div className={userTask.length ? "readOnlyInput" : ""}>
                    <label htmlFor = "backEndSourceURL">Back End Source Code URL:</label><br/>
                    <input id = "backEndSourceURL" type = "text" onChange = {(e)=>onBackEndSourceChange(e)} required
                        readOnly={userTask.length} value={userTask.length ? userTask[0].backEndSourceURL : backEndSourceURL}/>
                </div>
                <div className={userTask.length ? "readOnlyInput" : ""}>
                    <label htmlFor = "backEnddeployedURL">Back End Deployment URL:</label><br/>
                    <input id = "backEnddeployedURL" type = "text" onChange = {(e)=>onBackEndDeploymentURLChange(e)} required
                        readOnly={userTask.length} value={userTask.length ? userTask[0].backEndDeployedURL : backEndDeploymentURL}/><br/>
                </div>
                <Button type="submit" variant="contained" disabled={userTask.length}>Submit</Button>
                <div className="note">* If any input field is not relevant to particular task kindly fill "NA".</div>
           </form>
        </Card>
    );
}