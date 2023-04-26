import React from 'react'
import CanvasJSReact from '../../assests/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
export default function Analytics() {
    const options = {
        animationEnabled: true,
        title: {
            text: "Progress"
        },
        axisX: {
            valueFormatString: "MMM"
        },
        axisY: {
            title: "No of Problem Solved",
        },
        data: [{
            yValueFormatString: "#",
            xValueFormatString: "MMMM",
            type: "spline",
            dataPoints: [
                { x: new Date(2017, 0), y: 0 },
                { x: new Date(2017, 1), y: 0 },
                { x: new Date(2017, 2), y: 0 },
                { x: new Date(2017, 3), y: 0 },
                { x: new Date(2017, 4), y: 20 },
                { x: new Date(2017, 5), y: 8 },
                { x: new Date(2017, 6), y: 7 },
                { x: new Date(2017, 7), y: 10 },
                { x: new Date(2017, 8), y: 45 },
                { x: new Date(2017, 9), y: 23 },
                { x: new Date(2017, 10), y: 12 },
                { x: new Date(2017, 11), y: 11 }
            ]
        }]
    }
    return (
        <>
            <div class="mt-6 mr-5">
                <CanvasJSChart options={options} />
            </div>

            <br /> <br /> <br />
        </>

    )
}




