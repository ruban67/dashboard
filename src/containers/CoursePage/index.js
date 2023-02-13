import { Button } from '@mui/material';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player'
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { API } from '../../global';
import { SideNavbar } from '../SideNavbar';

import "./coursepage.css";

export function CoursePage({navRef}){
    const navigate = useNavigate();
    const {courseName} = useParams();
    const location = useLocation();
    const [course, setCourse] = useState(location.state && location.state.course);
    const URL = course.courseURL;
    const courseData = location.state && location.state.courseData;
    const [duration, setDuration] = useState(0);
    const [played, setPlayed] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [showFinishButton, setFinishBtnVisibility] = useState(false);
    const [courseStatus, setCourseStatus] = useState({});
    const playerRef = useRef(null);
    const courseRef = useRef(null);


    let userDetails = localStorage.getItem("user");
    userDetails = userDetails && JSON.parse(userDetails);
    const userId = userDetails.userId;
    const userName = userDetails.userName;
    const token = userDetails.token;


    useEffect(() => {
        getCourseStatus();
    }, [course])

    async function getCourseStatus(){
        const status = await fetch(`${API}/courses/${userId}/getCourseStatus/${course._id}`,{
            headers: {"x-auth-token" : token }
        }).then((data)=>{
            // console.log("data from api======", data);
            return data.json();
        });
        console.log("in getCourseStatus function ", status);
        courseRef.isCourseFinished = status.isCourseFinished;
        setCourseStatus(status);
    }

    async function updateCourseStatus(data){
        try{
            const result = await fetch(`${API}/courses/updateStatus/${course._id}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {"content-type": "application/json", "x-auth-token" : token }
            });
        }catch(error){
            console.log("Error in API for updation of course status - ",error )
        }
    }

    // const handleClickOutside = (event) => {
    //     event.preventDefault();
    //     console.log("In handleClickOutside  function",courseStatus);
    //     var percentage;
    //     if (courseRef.current && (courseRef.current.contains(event.target))) {
    //         // inside click
    //         return;
    //     }
    //     if(courseRef.isCourseFinished  !== undefined && !courseRef.isCourseFinished  && playerRef.current) {
    //         let duration = playerRef.current.getDuration();
    //         let currentTime = playerRef.current.getCurrentTime();
    //         percentage = (parseInt(currentTime) / parseInt(duration)) * 100;
    //         console.log("percentage on outside click", percentage);
    //         let data = {
    //             userName: userName,
    //             courseName : course.course,
    //             percentageCompleted: percentage,
    //             isCourseFinished : false
    //         }
    //         updateCourseStatus(data);
    //         getCourseStatus();
    //     }
    // };

    const handleProgress = (state) => {
        console.log('onProgress', state)
    }

    const handlePlay = () => {
        console.log('onPlay', playerRef.current.getDuration(), playerRef.current.getCurrentTime());
        finishButtonVisibility();
        setPlaying(true);
    }

    const handlePause = () => {
        console.log('on Pause', playerRef.current.getDuration(), playerRef.current.getCurrentTime());
        finishButtonVisibility();
        setPlaying(false);
    }

    const finishButtonVisibility = () => {
        let duration = playerRef.current.getDuration();
        let currentTime = playerRef.current.getCurrentTime();
        if(currentTime / duration > 0.97) {
            setFinishBtnVisibility(true);
        } else {
            setFinishBtnVisibility(false);
        }
    }

    const handleDuration = (duration) => {
        console.log('onDuration', duration)
        setDuration(duration);
    }

    const handleEnded = () => {
        setFinishBtnVisibility(true);
    }

    const onOtherCoursesClick = (e, selectedCourse) => {
        var percentage;
        if(courseRef.isCourseFinished  !== undefined && !courseRef.isCourseFinished  && playerRef.current) {
            let duration = playerRef.current.getDuration();
            let currentTime = playerRef.current.getCurrentTime();
            percentage = (parseInt(currentTime) / parseInt(duration)) * 100;
            let data = {
                userName: userName,
                courseName : course.course,
                percentageCompleted: percentage,
                isCourseFinished : false
            }
            updateCourseStatus(data);
            // getCourseStatus();
        }
        navigate(`/courses/${selectedCourse._id}`, {state:{courseData: courseData, course : selectedCourse}});
        setCourse(selectedCourse);
    }


    const onFinishCourse = () => {
        let data = {
            userName: userName,
            courseName : course.course,
            percentageCompleted: 100,
            isCourseFinished : true
        }
        // setFinishBtnVisibility(false);
        updateCourseStatus(data);
        getCourseStatus();
    }

    const onNavClick = (navItem) => {
        let percentage;
        if(courseRef.isCourseFinished  !== undefined && !courseRef.isCourseFinished  && playerRef.current) {
            let duration = playerRef.current.getDuration();
            let currentTime = playerRef.current.getCurrentTime();
            percentage = (parseInt(currentTime) / parseInt(duration)) * 100;
            console.log("percentage on outside click", percentage);
            let data = {
                userName: userName,
                courseName : course.course,
                percentageCompleted: percentage,
                isCourseFinished : false
            }
            updateCourseStatus(data);
            getCourseStatus();
        }
        navigate(`${navItem}`);
    }

    return localStorage.getItem("user") ? (
        <React.Fragment>
            <SideNavbar onClick={onNavClick} type="course"/>
            <div className="courseWrapper" ref={courseRef}>
                <div className='leftPlayerWrapper'>
                    <ReactPlayer
                        className="reactPlayer"
                        ref={playerRef}
                        url={URL}
                        playing={true}
                        controls={true}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onEnded={handleEnded}
                        onError={e => console.log('onError', e)}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                    />
                    {
                    !courseStatus.isCourseFinished ? 
                        <Button disabled={!showFinishButton} className={!showFinishButton ? "disabledFinishButton" : "finishButton"}
                            onClick = {onFinishCourse} variant="contained">Finsih Course</Button> :
                        <div className = "courseCompletion">You have successfully completed the course</div>
                    }
                </div>
                <div className='rightNavAllCourses'>
                    <h3>All Courses</h3>
                    {courseData.map((course, index) => {
                        return course.courseURL !== URL && (
                        <div className="courseCard" key={index} onClick={(e) => onOtherCoursesClick(e, course)}>
                            <img src={course.coverPage} alt={course.course}/>
                            <div className='courseDescription'>
                                <h2>{course.course}</h2>
                                <p>{course.description}</p>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </React.Fragment>
    ) :
    (
        <Navigate to ="/login" />
    );
}