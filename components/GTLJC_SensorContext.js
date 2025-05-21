// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

import React from "react";
import { createContext, useContext, useState } from "react";

const GTLJC_SensorContext_ = createContext();

export const useSensor = () => useContext(GTLJC_SensorContext_);

export const GTLJC_SensorProvider = ({children}) => {
    const [GTLJC_acceleration, GTLJC_setAcceleration] = useState({acc_x:0, acc_y:0, acc_z:0});
    const [GTLJC_rotation, GTLJC_setRotation] = useState({rot_x:0, rot_y:0, rot_z:0});


    return(
        <GTLJC_SensorContext_.Provider value = {{GTLJC_acceleration, GTLJC_setAcceleration, GTLJC_rotation, GTLJC_setRotation}} >
            {children}
        </GTLJC_SensorContext_.Provider>
    )
}