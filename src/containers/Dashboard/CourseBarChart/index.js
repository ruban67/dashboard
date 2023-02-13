import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import "./courseBarChart.css";

export function CourseBarChart({userCourseDetails}) {
    return (
        <div className='courseBarChartContainer'>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    className='courseBarChart'
                    width={500}
                    height={300}
                    data={userCourseDetails}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="courseName" tick={{stroke: "white"}}/>
                <YAxis tick={{stroke: "white"}}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="percentageCompletion" fill="#8884d8" layout="horizontal" />
                </BarChart>
        </ResponsiveContainer>
      </div>
    );
}