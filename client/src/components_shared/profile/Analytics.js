import React, { useState, useEffect } from 'react'
import CanvasJSReact from '../../assests/canvasjs.react';
import { url } from '../Request';
import { getUserToken } from '../../components_login/Token';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Analytics() {

    const [dataPoints, setDataPoints] = useState([
        { x: new Date(2023, 0), y: 0 },
        { x: new Date(2023, 1), y: 0 },
        { x: new Date(2023, 2), y: 0 },
        { x: new Date(2023, 3), y: 0 },
        { x: new Date(2023, 4), y: 0 },
        { x: new Date(2023, 5), y: 0 },
        { x: new Date(2023, 6), y: 0 },
        { x: new Date(2023, 7), y: 0 },
        { x: new Date(2023, 8), y: 0 },
        { x: new Date(2023, 9), y: 0 },
        { x: new Date(2023, 10), y: 0 },
        { x: new Date(2023, 11), y: 0 },

    ]);
    const [isLoading, setIsLoading] = useState(true);

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
            dataPoints: dataPoints
        }]
    }

    async function fetchAnalytics() {

        const response = await fetch(`${url}/fetchAllSubmissions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userToken: getUserToken(), aisehi: "aisehi" })
        });
        console.log("Hello");
        return response.json();
    }

    function getCountSubs(month, year, values) {
        let key = year + "-" + month;
        if (month < 10) {
            key = year + "-0" + month;
        }
        return values.get(key);
    }

    function initialDataPoints(dataHashMap) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();

        let newDataPoints = [];
        let i;
        for (i = 0; i < 12; i++) {
            if (month < i) {
                let count = getCountSubs(i, year - 1, dataHashMap);
                if (count == null) {
                    count = 0;
                }
                newDataPoints.push(
                    { x: new Date(year - 1, i), y: count }
                )
            }
        }

        for (i = 0; i < 12; i++) {
            if (month >= i) {
                let count = getCountSubs(i, year, dataHashMap);
                if (count == null) {
                    count = 0;
                }
                newDataPoints.push(
                    { x: new Date(year, i), y: count }
                )
            }
        }
        return newDataPoints;
    }

    function getDataPoints(subs) {
        var dataHashMap = new Map();

        subs.forEach(sub => {
            const subYM = sub.timestamp.substring(0, 7);
            if (dataHashMap.has(subYM)) {
                let count = dataHashMap.get(subYM) + 1;
                dataHashMap.delete(subYM);
                dataHashMap.set(subYM, count);
            }
            else {
                dataHashMap.set(subYM, 1);
            }
        });
        return initialDataPoints(dataHashMap);
    }

    useEffect(() => {
        fetchAnalytics().then((data) => {
            if (data.success) {
                setDataPoints(getDataPoints(data.submissions));
            }
        }).catch((e) => {
            console.log(e);
        })
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {
                isLoading
                    ?
                    <div class="mt-6 mr-5">
                    </div>
                    :
                    <div class="mt-6 mr-5">
                        <CanvasJSChart options={options} />
                    </div>
            }
            <br /> <br /> <br />
        </>

    )
}




