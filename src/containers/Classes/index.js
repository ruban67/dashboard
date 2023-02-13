import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API } from "../../global";
import { SideNavbar } from "../SideNavbar";
import "./classes.css";


export function Classes(){


    const initialClassData={
        "classTopic" : "Click on classes to obtain details",
    }

    const navigate = useNavigate();
    const [allClassesData, setAllClassesData] = useState([]);
    const [classData, setClassData] = useState({});
    const [displayJoiningLink, setDiaplayJoiningLink] = useState(false);


    let userDetails = localStorage.getItem("user");
    userDetails = userDetails && JSON.parse(userDetails);
    const token = userDetails && userDetails.token;


    async function getAllClasses(){
        const result = await fetch(`${API}/classes/getAllClasses`,{
            headers: {"x-auth-token" : token }
        }).then((data)=>data.json());
        setAllClassesData(result);
    }

    // async function getClassInfoById(id){
    //     const result = await fetch(`${API}/classes/getClassById/${id}`).then((data)=>data.json());
    //     setClassData(result);
    //     console.log("byID",classData);
    // }

    useEffect(()=>{
        getAllClasses();
    },[]);


    const classExpand = (value)=>{
        setClassData(value);
        setDiaplayJoiningLink(false);
    }

    return localStorage.getItem("user") ? (
        <div className="classesContainer">
            <div className = "classesContentWrapper">
                {Object.keys(classData).length ? 
                    <ClassInfo classData = {classData} displayJoiningLink = {displayJoiningLink} setDiaplayJoiningLink = {setDiaplayJoiningLink}/> :
                   
                    <div className="initlaClassContainer">
                        <h2 className="initlaClassHeader">{initialClassData.classTopic}</h2>
                        <img src="./Assets/rightArrow.png"/>
                    </div>
                }     
            </div>
            <div className="classListContainer">
                <h2 className="classListHeader">Curriculum </h2>
                <div className = "classListWrapper">
                    {allClassesData.map((value,index)=>{
                        return <Button key = {value._id} onClick = {()=>classExpand(value)}>{`Class - 0${index+1}`}</Button>
                    })}
                </div>
            </div>
        </div>
    ) :
    (
        <Navigate to ="/login" />
    );
}

export function ClassInfo({classData,displayJoiningLink,setDiaplayJoiningLink}){

    const currentDate = new Date();
    const currentDateStart = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());
    const currentDateEnd = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+1);
    const courseDate = classData.date && new Date(classData.date);
    console.log(currentDateStart,currentDateEnd, courseDate);
   
   
   const joinClassSetting = ()=>{
        setDiaplayJoiningLink(true);
   }
   
    return (
        <div className = "classInfoWrapper">
            <div className="header">
                <span className = "topic">{classData.classTopic}:</span>
                {courseDate >= currentDateStart ?
                    <Button className = "joinClass" onClick={joinClassSetting}>Join Class</Button> :
                    <span className = "classFinished"> {classData.date && `Class Completed on ${courseDate.toLocaleDateString()}` }</span>
                }
            </div>
            <div className="classInfoContentWrapper">
                <div>
                    <div className = "dateAndDayWrapper">
                        <div className = "day">{classData.day}:</div>
                        <div className="dateWrapper">
                            <span className = "date">{classData.date}</span>
                            <span className = "time">{classData.time}</span>
                        </div>
                    </div>
                    <div className = "keyAreas">
                        <div className="keyAreasheading">{classData.KeyAreas && "Today's Topics are as follows : "}</div>
                        <div>
                            <ul>
                                {classData.KeyAreas  && classData.KeyAreas.map((value)=>{
                                    return <li>{value}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                {displayJoiningLink ? 
                    <div className="joiningLinkWrapper">
                        <div className = "classLink">
                            <a href={classData.classLink} target = "_blank">Click here to join class</a>
                            <div className="meetingInfo">
                                <div>In case of any difficulty using above link use the following credentials to join class</div> 
                                <div className="meetingId">
                                    <span>Meeting Id : </span>
                                    {classData.meetingId}
                                </div>
                                <div className="passcode">
                                    <span>Passcode : </span>
                                    {classData.passcode}
                                </div>
                            </div>
                        </div>
                    </div> : 
                    null
                }
            </div>
        </div>
    );
}