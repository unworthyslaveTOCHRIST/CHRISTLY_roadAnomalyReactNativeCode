// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE'
import React, { use } from "react";
import { View, Text, Dimensions} from "react-native"
import { useState,useEffect , useRef} from "react";
import { useRouter } from "expo-router";
import { Accelerometer, Gyroscope } from "expo-sensors";

import { LineChart } from "react-native-chart-kit";

import { useSensor } from "../../components/GTLJC_SensorContext";
import { Line } from "react-native-svg";
// import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import Geolocation from "react-native-geolocation-service";

import * as FileSystem from "expo-file-system";
import * as MediaLibrarya from "expo-media-library";


export default function GTLJC_TabVisualize(){

    const {
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
                GTLJC_zData, GTLJC_setZData
            } = useSensor();
        
        
    // useEffect(()=>{
    //     const GTLJC_watchId = Geolocation.watchPosition(
    //         (GTLJC_position)=>{
    //         console.log(GTLJC_position)
    //         },
    //         (GTLJC_err)=>console.error(GTLJC_err),
    //         {
    //         enableHighAccuracy : true,
    //         distanceFilter : 0,
    //         interval : 1000,
    //         fastestInterval : 500
    //         }
    //     );

    //     return ()=> Geolocation.clearWatch(GTLJC_watchId);
        
    // },[]);

    const GTLJC_screenWidth = Dimensions.get("window").width;

    const GTLJC_updateCounter = useRef(0)
    useEffect(()=>{

        GTLJC_updateCounter.current += 1;
// 
        if (GTLJC_updateCounter % 20 !== 0) return;
        GTLJC_setXData((GTLJC_prev)=>GTLJC_prev.length > 30 ? [...GTLJC_prev.slice(1),GTLJC_acceleration.acc_x] : [...GTLJC_prev,GTLJC_acceleration.acc_x])
        GTLJC_setYData((GTLJC_prev)=>GTLJC_prev.length > 30 ? [...GTLJC_prev.slice(1),GTLJC_acceleration.acc_y] : [...GTLJC_prev,GTLJC_acceleration.acc_y])
        GTLJC_setZData((GTLJC_prev)=>GTLJC_prev.length > 30 ? [...GTLJC_prev.slice(1),GTLJC_acceleration.acc_z] : [...GTLJC_prev,GTLJC_acceleration.acc_z])
        
    
    
    
    },[GTLJC_acceleration.acc_x])
    
    const GTLJC_data = {
        // labels : Array.from({length: GTLJC_xData.length}, ()=>""),
        datasets : [
            {
                data : GTLJC_xData,
                color : () => "red",
                strokeWidth : 2,
            },

            {
                data : GTLJC_yData,
                color : () => "green",
                strokeWidth : 2,
            },

            {
                data : GTLJC_zData,
                color : () => "blue",
                strokeWidth : 2,
            },
        ],
        legend : ["X-axis", "Y-axis", "Z-axis"],
        
    };



    return(
        <View>
            <Text>
                Christly Acceleration in x : {JSON.stringify(GTLJC_acceleration)}
            </Text>
             <Text>
                Christly Rotation along x : {JSON.stringify(GTLJC_rotation)}
            </Text>
            
            <Text>
                Christly batch id of data : {JSON.stringify(GTLJC_batchId)}
            </Text>
            <Text>
                Christly date of data : {JSON.stringify(GTLJC_date)}
            </Text>
            <Text>
                Christly position of data instance in batch {GTLJC_batchId}: {JSON.stringify(GTLJC_counter)}
            </Text>
            <Text>
                Christly time interval in milliseconds of data instance : {JSON.stringify( GTLJC_intervalMilli)}
            </Text>
            <Text>
                Christly speed log: {JSON.stringify( GTLJC_speed)}
            </Text>

            <Text>
                Christly latitude: {JSON.stringify( GTLJC_latitude)}
            </Text>

            <Text>
                Christly longitude: {JSON.stringify( GTLJC_longitude)}
            </Text>

            <Text>
                Christly accuracy of data instance : {JSON.stringify( GTLJC_accuracy)}
            </Text>

            <Text
                style = {{
                    textAlign : "center",
                    marginTop : 20,
                    fontWeight : "bold"
                }}
            >
                Accelerometer Live Data
            </Text>
            {/* <LineChart
                data= {GTLJC_data && GTLJC_data}
                width={GTLJC_screenWidth}
                height={ 250 }
                    chartConfig={{
                    backgroundColor: '#000000',
                    backgroundGradientFrom: '#1e1e1e',
                    backgroundGradientTo: '#333333',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
                    propsForDots: {
                    r: '0',
                    },
                    propsForLabels: {}, // Add this to fix the error!
                }}

                bezier
                withInnerLines = {false}
                fromZero
                style = {{marginVertical : 20, borderRadius: 20}}
            /> */}
        </View>
    )
}




// import React, { useEffect, useState } from 'react';
// import { View, Dimensions } from 'react-native';
// import { Accelerometer } from 'expo-sensors';
// import { Canvas, Path, Skia, useValue, useSharedValueEffect } from '@shopify/react-native-skia';

// const screenWidth = Dimensions.get('window').width;
// const maxPoints = 100;

// export default function SkiaAccelerometerChart() {
//   const [accData, setAccData] = useState([]);

//   const pathX = useValue(Skia.Path.Make());
//   const pathY = useValue(Skia.Path.Make());
//   const pathZ = useValue(Skia.Path.Make());

//   useEffect(() => {
//     Accelerometer.setUpdateInterval(100);

//     const subscription = Accelerometer.addListener(({ x, y, z }) => {
//       setAccData((prev) => {
//         const newData = [...prev, { x, y, z }];
//         return newData.length > maxPoints ? newData.slice(-maxPoints) : newData;
//       });
//     });

//     return () => subscription.remove();
//   }, []);

//   useEffect(() => {
//     const pathGen = (axis) => {
//       const p = Skia.Path.Make();
//       accData.forEach((point, i) => {
//         const xPos = (screenWidth / maxPoints) * i;
//         const yPos = 125 - point[axis] * 50;
//         if (i === 0) p.moveTo(xPos, yPos);
//         else p.lineTo(xPos, yPos);
//       });
//       return p;
//     };

//     pathX.current = pathGen('x');
//     pathY.current = pathGen('y');
//     pathZ.current = pathGen('z');
//   }, [accData]);

//   return (
//     <View style={{ flex: 1, backgroundColor: '#000' }}>
//       <Canvas style={{ width: screenWidth, height: 250 }}>
//         <Path path={pathX} color="red" style="stroke" strokeWidth={2} />
//         <Path path={pathY} color="green" style="stroke" strokeWidth={2} />
//         <Path path={pathZ} color="blue" style="stroke" strokeWidth={2} />
//       </Canvas>
//     </View>
//   );
// }
