// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE'
import React from "react";
import { View, Text} from "react-native"
import { useState,useEffect } from "react";
import { useRouter } from "expo-router";
import { Accelerometer, Gyroscope } from "expo-sensors";
import { useSensor } from "../../components/GTLJC_SensorContext";

export default function GTLJC_TabVisualize(){

    const {GTLJC_acceleration, GTLJC_rotation} = useSensor();


    return(
        <View>
            <Text>
                Christly Acceleration in x : {JSON.stringify(GTLJC_acceleration)}
            </Text>
             <Text>
                Christly Rotation along x : {JSON.stringify(GTLJC_rotation)}
            </Text>
            
        </View>
    )
}