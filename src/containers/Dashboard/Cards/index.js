import { Card, CardContent } from "@mui/material";
import React from "react";

import "./cards.css";

export function DashboardCard({dashboardCount}) {
    return (
        <div className="dashboardCardContainer">
            {Object.keys(dashboardCount).map((count, index) => {
                return (
                    <Card className={`dashBoardcard${index}`}>
                        <CardContent className="dashBoardCardContent">
                            <div>
                                <h4>{count}</h4>
                                <h1>{dashboardCount[count]}</h1>
                            </div>
                            <div>
                                <img src={`./Assets/${count}.png`} />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}