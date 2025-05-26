// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

import React from "react";
import { createContext, useContext, useState, useRef } from "react";

const GTLJC_SensorContext_ = createContext();

export const useSensor = () => useContext(GTLJC_SensorContext_);

export const GTLJC_SensorProvider = ({children}) => {
    const [GTLJC_acceleration, GTLJC_setAcceleration] = useState({acc_x:0, acc_y:0, acc_z:0});
    const [GTLJC_rotation, GTLJC_setRotation] = useState({rot_x:0, rot_y:0, rot_z:0});
    const [GTLJC_batchId, GTLJC_setBatchId] = React.useState(0)
    const [GTLJC_date, GTLJC_setDate] = React.useState((new Date).toISOString())
    const [GTLJC_counter, GTLJC_setCounter] = React.useState(0)
    const [GTLJC_intervalMilli, GTLJC_setIntervalMilli] = React.useState((new Date).getMilliseconds())
    const [GTLJC_speed, GTLJC_setSpeed] = React.useState(0) 
    const [GTLJC_latitude, GTLJC_setLatitude] = React.useState(0) 
    const [GTLJC_longitude, GTLJC_setLongitude] = React.useState(0) 
    const [GTLJC_accuracy, GTLJC_setAccuracy] = React.useState(0) 
    const [GTLJC_xData, GTLJC_setXData] = useState([0,0]);
    const [GTLJC_yData, GTLJC_setYData] = useState([0,0]);
    const [GTLJC_zData, GTLJC_setZData] = useState([0,0]);
    const GTLJC_accelRef = useRef({ acc_x: 0, acc_y: 0, acc_z: 0 });
    const GTLJC_gyroRef  = useRef({ rot_x: 0, rot_y: 0, rot_z: 0 });
    const [GTLJC_sampleRate, GTLJC_setSampleRate] = useState(50);
    const GTLJC_latitudeRef = useRef(0);
    const GTLJC_longitudeRef = useRef(0);
    const GTLJC_speedRef = useRef(0);
    const GTLJC_gpsAccuracyRef = useRef(0);




    return(
        <GTLJC_SensorContext_.Provider 
        value = {{
                GTLJC_acceleration,GTLJC_setAcceleration, 
                GTLJC_rotation,GTLJC_setRotation,
                GTLJC_batchId,GTLJC_setBatchId,
                GTLJC_date, GTLJC_setDate,
                GTLJC_counter, GTLJC_setCounter,
                GTLJC_intervalMilli, GTLJC_setIntervalMilli,
                GTLJC_speed, GTLJC_setSpeed,
                GTLJC_latitude, GTLJC_setLatitude,
                GTLJC_longitude, GTLJC_setLongitude,
                GTLJC_accuracy, GTLJC_setAccuracy,
                GTLJC_xData, GTLJC_setXData,
                GTLJC_yData, GTLJC_setYData,
                GTLJC_zData, GTLJC_setZData,
                GTLJC_accelRef, GTLJC_gyroRef,
                GTLJC_sampleRate, GTLJC_setSampleRate,
                GTLJC_latitudeRef, GTLJC_longitudeRef,
                GTLJC_speedRef, GTLJC_gpsAccuracyRef

            }} 
        >
            {children}
        </GTLJC_SensorContext_.Provider>
    )
}