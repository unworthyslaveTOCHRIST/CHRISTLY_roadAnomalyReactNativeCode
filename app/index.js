// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE
import React, { useEffect, useRef,useState } from "react";
import { Alert, Button, StyleSheet, View, Text, Platform, Image } from "react-native";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { GTLJC_locationList } from "../GTLJC_LocationList";
// import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native";
import {useBottomTabOverflow} from "../components/ui/TabBarBackground"
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
// import { coolDownAsync } from "expo-web-browser";
import * as Location from "expo-location"
import { Accelerometer, Gyroscope } from 'expo-sensors';
import {useImage} from "expo-image"
// import MapView from "react-native-maps"



const GTLJC_SF_ZOOM = 12;

let GTLJC_userLocationGlobal = false;

  
export default function GTLJC_RootIndex(){
    const GTLJC_smoothroadIcon = useImage(require("../assets/images/smooth_FORCHRIST.jpg"))
    const GTLJC_potholeIcon = useImage(require("../assets/images/pothole_FORCHRIST.jpg"))
    const GTLJC_crackIcon = useImage(require("../assets/images/crack_FORCHRIST.jpg"))
    const GTLJC_bumpIcon = useImage(require("../assets/images/bump_FORCHRIST.jpg"))

    const GTLJC_icons = {
      smooth : GTLJC_smoothroadIcon,
      crack : GTLJC_crackIcon,
      pothole_mild : GTLJC_potholeIcon,
      pothole_severe : GTLJC_potholeIcon,
      bump : GTLJC_bumpIcon
    };

    const GTLJC_bottom = useBottomTabOverflow();
    const [GTLJC_locationIndex, GTLJC_setLocationIndex] = React.useState(0)
    const [GTLJC_userLocation, GTLJC_setUserLocation] = React.useState(null);   
    const [GTLJC_markersGoogle, GTLJC_setMarkersGoogle] = React.useState([]);

    
    const ref =  React.useRef(null)
    const [GTLJC_permission, GTLJC_setPermission] = React.useState(null);
    const [GTLJC_cameraPosition, GTLJC_setCameraPosition] = React.useState({
      // coordinates : {
      //   latitude : 31.771959,
      //   longitude : 35.217018
      // }
      coordinates : {
        latitude : 9.081999,
        longitude : 8.675277
      },
      zoom : 1
    });


    const [GTLJC_inData, GTLJC_setInData] = React.useState([])
    const [GTLJC_outData, GTLJC_setOutData] = React.useState([{
        batch_id : 0,
        acc_x,
        acc_y,
        acc_z,
        rot_x,
        rot_y,
        rot_z,
        speed : 0,
        log_interval : 0,
        latitude : 0,
        longitude : 0,
        accuracy : 0,
        timestamp : (new Date).toISOString(),


    }])

    const [GTLJC_date, GTLJC_setDate] = React.useState((new Date).toISOString())
    const [GTLJC_batchId, GTLJC_setbatchId] = React.useState(0)
    const [GTLJC_counter, GTLJC_setCounter] = React.useState(0)
    const [GTLJC_intervalMilli, GTLJC_setIntervalMilli] = React.useState((new Date).getMilliseconds())
    const [GTLJC_repeatDet, GTLJC_setRepeatTimer] = React.useState(0)

    const [{ acc_x, acc_y, acc_z}, GTLJC_setData] = useState({
    acc_x: 0,
    acc_y: 0,
    acc_z: 0,
  });


  const [{ rot_x, rot_y, rot_z}, GTLJC_setData_gyr] = useState({
    rot_x: 0,
    rot_y: 0,
    rot_z: 0,
  });

  const [subscription, setSubscription] = useState(null);
  const [subscription_gyr, setSubscription_gyr] = useState(null);

  Accelerometer.setUpdateInterval(5000);
  Gyroscope.setUpdateInterval(30);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener( accelerometerData =>
      GTLJC_setData({
        acc_x : accelerometerData.x,
        acc_y : accelerometerData.y,
        acc_z : accelerometerData.z
      })
    
    ));
    setSubscription_gyr(
      Gyroscope.addListener(gyroScopeData =>{
        GTLJC_setData_gyr({
          rot_x : gyroScopeData.x * 9.81,
          rot_y : gyroScopeData.y * 9.81,
          rot_z : gyroScopeData.z * 9.81
        } )
      })
    )
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    subscription_gyr && subscription_gyr.remove();
    setSubscription(null);
    setSubscription_gyr(null);
  };

  React.useEffect(()=>{
    setTimeout(
      ()=>{
          const GTLJC_getLocation = async ()=>{

            const GTLJC_status = await Location.requestForegroundPermissionsAsync()
            if (GTLJC_status !== "granted") {
              "";
            }

            const GTLJC_location = await Location.getCurrentPositionAsync({});
            console.log(GTLJC_location);

            ref.current?.setCameraPosition({
                coordinates :{
                  latitude : GTLJC_location.coords.latitude,
                  longitude : GTLJC_location.coords.longitude
              },
                zoom : 17,
            });
            console.log(ref)

            GTLJC_setUserLocation({
              coordinates :{
                latitude : GTLJC_location.coords.latitude,
                longitude : GTLJC_location.coords.longitude
              },
              zoom : 17
            })

            
         
          }

        GTLJC_getLocation();
      },3000)      

  },[])

  function GTLJC_chooseIcon(GTLJC_anomaly){
    if (GTLJC_anomaly == "smooth"){
      return "../assets/images/smooth_FORCHRIST.jpg"
    }
  }
  useEffect(
    ()=>{
            if (GTLJC_userLocation && GTLJC_inData) {
              //  console.log("Gracious user location set globally: ", GTLJC_userLocation);

              const GTLJC_inDataMapped = GTLJC_inData && GTLJC_inData.map((GTLJC_item)=>{

                    return(
                        
                      {
                        coordinates : {
                          latitude : GTLJC_item.latitude,
                          longitude : GTLJC_item.longitude
                        },
                        title : GTLJC_item.anomaly.toUpperCase(),
                        snippet : GTLJC_item.anomaly,
                        draggable : true,
                        icon : GTLJC_icons[GTLJC_item.anomaly]
                      }
                    )
                  })
                
              // console.log(JSON.stringify(GTLJC_inDataMapped))
            
               GTLJC_setMarkersGoogle([
                  {
                    coordinates : {
                      latitude : GTLJC_userLocation.latitude,
                      longitude : GTLJC_userLocation.longitude
                    },
                    title : "User Current Location ",
                    snippet : "User Current Location",
                    draggable : true,
                    // showCallout : true,
                    // icon : "",
                    // mapToolbarEnabled : false

                  },
                  ...GTLJC_inDataMapped
       
                ])
            }         
            

        }
  ,[rot_x])

  useEffect(()=>{
    let GTLJC_subscription = null;

    const GTLJC_startLocationUpdates = async () =>{
      const GTLJC_status = await Location.requestForegroundPermissionsAsync()
            if (GTLJC_status !== "granted") {
              "";
            }

      GTLJC_subscription = await Location.watchPositionAsync(
        {
          accuracy : Location.Accuracy.Higest,
          timeInterval : 100,
          distanceInterval : 0 // To graciously update regardless of movement
        },
        (GTLJC_newLocation)=>{
              ref.current?.setCameraPosition({
              coordinates :{
                latitude : GTLJC_newLocation.coords.latitude,
                longitude : GTLJC_newLocation.coords.longitude
            },
              zoom :10,
          });

           GTLJC_setUserLocation(GTLJC_newLocation.coords)

          console.log(GTLJC_newLocation.coords);
          console.log(ref)
        }     
      )  

    }

    GTLJC_startLocationUpdates();

    return ()=>{
      if (GTLJC_subscription){
        GTLJC_subscription.remove();
      }
    };
  },[])


  const GTLJC_getDataIn = async ()=>{

    GTLJC_setRepeatTimer(GTLJC_prev=>GTLJC_prev + 1);
    const GTLJC_res = await fetch("https://roadanomalyforchrist.pythonanywhere.com/api-road-in/road_anomaly_in/").catch(err=>console.log(err))
    const GTLJC_resJson = await GTLJC_res.json()
    GTLJC_setInData(GTLJC_resJson)
    // console.log(GTLJC_resJson)
  }

  const GTLJC_getDataOut = async ()=>{

    GTLJC_setRepeatTimer(GTLJC_prev=>GTLJC_prev + 1);
    GTLJC_setCounter(GTLJC_prev=>GTLJC_prev + 1)
    GTLJC_setDate((new Date).toISOString())
    if (GTLJC_counter >= 59){
      GTLJC_setCounter(0);
      GTLJC_setbatchId((GTLJC_prev)=> GTLJC_prev + 1)
      GTLJC_outData.forEach(GTLJC_log=>{
        async ()=>{
          const GTLJC_res = await fetch("https://roadanomalyforchrist.pythonanywhere.com/api-road-out/road_anomaly_out/",
            {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(GTLJC_log)
                  }
              ).catch(err=>console.log(err))

            const GTLJC_resJson = await GTLJC_res.json();
            console.log(GTLJC_resJson);
          }
        }
      )
      GTLJC_setOutData([]);
    }
    GTLJC_setIntervalMilli((new Date).getMilliseconds())
    
    GTLJC_setOutData((GTLJC_prev)=>[
      ...GTLJC_prev,
      {
        batch_id : GTLJC_batchId,
        acc_x,
        acc_y,
        acc_z,
        rot_x,
        rot_y,
        rot_z,
        speed : GTLJC_userLocation && GTLJC_userLocation.speed,
        timestamp : GTLJC_date,
        log_interval : GTLJC_intervalMilli,
        latitude :GTLJC_userLocation && GTLJC_userLocation.latitude,
        longitude :GTLJC_userLocation && GTLJC_userLocation.longitude,
        accuracy :GTLJC_userLocation && GTLJC_userLocation.accuracy

     }
    ]
  )

    // console.log("BY GOD'S GRACE ALONE : " + GTLJC_outData.batch_id );

    // const GTLJC_res = await fetch("https://roadanomalyforchrist.pythonanywhere.com/api-road-out/road_anomaly_out/",
    //           {
    //             method : 'POST',
    //             headers : {
    //                 'Content-Type' : 'application/json',
    //             },
    //             body : JSON.stringify(GTLJC_outData)
    //           }
    //       ).catch(err=>console.log(err))

    // const GTLJC_resJson = await GTLJC_res.json();
    // console.log(GTLJC_resJson);

  }

  const [GTLJC_sendData, GTLJC_setSendData] = React.useState(true)
    useEffect(() => {
      _subscribe();
      GTLJC_getDataIn();
      setInterval(()=>{
        GTLJC_sendData && GTLJC_getDataOut()
      }, 60000)
      // {GTLJC_sendData && GTLJC_getDataOut();}
      return () => _unsubscribe();
    }, [rot_x]);



    

  function GTLJC_handleChangeWithRef(GTLJC_direction){
      console.log(GTLJC_direction);
      const GTLJC_newIndex = GTLJC_locationIndex + (GTLJC_direction == "gtljc_next" ? 1 : -1)
      console.log(GTLJC_newIndex)
      const GTLJC_nextLocation = GTLJC_markersGoogle[GTLJC_newIndex];

      // Graciously setting camera first to ensure animation happens
      ref.current?.setCameraPosition({
          coordinates : {
              latitude: GTLJC_nextLocation.stores[0].point[0],
              longitude : GTLJC_nextLocation.stores[0].point[1],
          },

          zoom : 17,
      });
      console.log(ref)

      // Graciously update state after animation is triggered
      GTLJC_setLocationIndex(GTLJC_newIndex)


  }

  const GTLJC_renderMapControls = () => {

      return(
            <>
          <View style = {{flex : 8}}  pointerEvents="none" />

          <View style = {styles.controlsContainer} pointerEvents="auto">
              {/* 1 */}
              <Button title = "GTLJC_Prev" onPress = {() => GTLJC_handleChangeWithRef("gtljc_prev")} />
              <Button title = "GTLJC_Next" onPress = {()=> GTLJC_handleChangeWithRef("gtljc_next")} />
          </View>
      </>
      )
      
  }
  if (Platform.OS === "ios"){
      return(
          <>
              <AppleMaps.View
                  style = {StyleSheet.absoluteFill}
                  cameraPosition={{
                      coordinates : {
                          latitude : 37.8199,
                          longitude : -122.4783
                      },
                      zoom : 12
                  }}
              />
          </>
      )
  }
  else if (Platform.OS === "android"){
      return(
            <>
              <GoogleMaps.View
                  style = {StyleSheet.absoluteFill}
                  cameraPosition = {GTLJC_cameraPosition}
                  ref={ref}
                  markers = {GTLJC_markersGoogle}
                  polylines={[
                    {
                      color : "blue",
                      coordinates : GTLJC_polylineCoordinates,
                      width : 10,
                      // geodesic : true
                    }
                  ]}

                  properties={{
                      mapType : GoogleMapsMapType.NORMAL,
                      isBuildingEnabled : true,
                      isIndoorEnabled : true,
                      isMyLocationEnabled : true, // Graciously requires location permission
                      selectionEnabled: true,
                      // isTrafficEnabled: true,
                      // minZoomPreference: 21,
                      // maxZoomPreference: 20,
                    }}

                    userLocation={{
                      followUserLocation : true,
                      // coordinates : 
                    }}

                    uiSettings={{
                      zoomControlsEnabled : true,
                      // myLocationButtonEnabled : true,
                      compassEnabled : true,
                      mapToolbarEnabled : false
                    }}

                    // onPolylineClick={(event) => {
                    //   console.log(event);
                    //   Alert.alert("Polyline clicked", JSON.stringify(event));
                    // }}
                    // onMapLoaded={() => {
                    //   console.log(JSON.stringify({ type: "onMapLoaded" }, null, 2));
                    // }}
                    onMapClick={(e) => {
                      console.log(
                        JSON.stringify({ type: "onMapClick", data: e }, null, 2)
                      );
                    }}
                    // onMapLongClick={(e) => {
                    //   console.log(
                    //     JSON.stringify({ type: "onMapLongClick", data: e }, null, 2)
                    //   );
                    // }}
                    // onPOIClick={(e) => {
                    //   console.log(
                    //     JSON.stringify({ type: "onPOIClick", data: e }, null, 2)
                    //   );
                    // }}
                    // onMarkerClick={(e) => {
                    //   console.log(
                    //     JSON.stringify({ type: "onMarkerClick", data: e }, null, 2)
                    //   );
                    // }}
                    // onCameraMove={(e) => {
                    //   console.log(
                    //     JSON.stringify({ type: "onCameraMove", data: e }, null, 2)
                    //   );
                    // }}
                />
               {GTLJC_renderMapControls()} 
                    
            </>
            
        )
    }
   
}


const styles = StyleSheet.create({
  controlsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingBottom : 20
  },
});


function GTLJC_setUserMarker(){
  if (GTLJC_userLocationGlobal){
    return GTLJC_userLocationGlobal.coordinates
  }

  return  { latitude: 49.268034, longitude: -123.154819 }
}

// const markersApple = [
//   {
//     coordinates: { latitude: 49.259133, longitude: -123.10079 },
//     title: "49th Parallel Café & Lucky's Doughnuts - Main Street",
//     tintColor: "brown",
//     systemImage: "cup.and.saucer.fill",
//   },
//   {
//     coordinates: { latitude: 49.268034, longitude: -123.154819 },
//     title: "49th Parallel Café & Lucky's Doughnuts - 4th Ave",
//     tintColor: "brown",
//     systemImage: "cup.and.saucer.fill",
//   },
//   {
//     coordinates: { latitude: 49.286036, longitude: -123.12303 },
//     title: "49th Parallel Café & Lucky's Doughnuts - Thurlow",
//     tintColor: "brown",
//     systemImage: "cup.and.saucer.fill",
//   },
//   {
//     coordinates: { latitude: 49.311879, longitude: -123.079241 },
//     title: "49th Parallel Café & Lucky's Doughnuts - Lonsdale",
//     tintColor: "brown",
//     systemImage: "cup.and.saucer.fill",
//   },
//   {
//     coordinates: {
//       latitude: 49.27235336018808,
//       longitude: -123.13455838338278,
//     },
//     title: "A La Mode Pie Café - Granville Island",
//     tintColor: "orange",
//     systemImage: "fork.knife",
//   },
// ];


const GTLJC_polylineCoordinates = [
  { latitude: 33.8121, longitude: -117.919 }, // Disneyland
  { latitude: 33.837, longitude: -117.912 },
  { latitude: 33.88, longitude: -117.9 },
  { latitude: 33.9456, longitude: -117.8735 },
  { latitude: 34.0, longitude: -117.85 },
  { latitude: 34.233, longitude: -118.2 },
  { latitude: 34.2355, longitude: -118.3 },
  { latitude: 34.1367, longitude: -118.2942 }, // Hollywood
  { latitude: 34.1341, longitude: -118.3215 }, // Hollywood Sign
  { latitude: 34.05, longitude: -117.82 },
  { latitude: 34.1, longitude: -117.78 },
  { latitude: 34.2, longitude: -118.0 },
  { latitude: 34.2222, longitude: -118.1234 },
  
];
