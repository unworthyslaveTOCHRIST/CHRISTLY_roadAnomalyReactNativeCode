// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE
import React, { useEffect, useRef,useState } from "react";
import {Alert, Button, StyleSheet, View, Text, Platform, Image, TouchableOpacity} from "react-native";
import { AppleMaps, GoogleMaps } from "expo-maps";

// import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native";


import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
// import { coolDownAsync } from "expo-web-browser";
import * as Location from "expo-location"
import { Accelerometer, Gyroscope } from 'expo-sensors';
import {useImage} from "expo-image";
import Polyline from "@mapbox/polyline"

import { useFocusEffect } from "@react-navigation/native";

import { useCallback } from "react";

// import MapView,{Marker} from "react-native-maps"

import { useLocalSearchParams } from "expo-router";

import { useSensor } from "../../components/GTLJC_SensorContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";




  
export default function GTLJC_RootIndex(){
    // console.log("Graciously re rendering GTLJC_Index in whole");

    const GTLJC_SF_ZOOM = 12;

    const GTLJC_smoothroadIcon = useImage(require("../../assets/images/smooth_FORCHRIST.jpg"))
    const GTLJC_potholeIcon = useImage(require("../../assets/images/pothole_FORCHRIST.jpg"))
    const GTLJC_crackIcon = useImage(require("../../assets/images/crack_FORCHRIST.jpg"))
    const GTLJC_bumpIcon = useImage(require("../../assets/images/bump_FORCHRIST.jpg"))
    const GTLJC_roadPatchIcon = useImage(require("../../assets/images/road_patch_FORCHRISTALONE.png"))
    const GTLJC_userLocationIcon = useImage(require("../../assets/images/user_loc_FORCHRISTALONE.png"))

    // const GTLJC_params = useLocalSearchParams();

    // useEffect(()=>{
    //     console.log("Graciously useeffect has been triggered by route params: ", GTLJC_params.t)
        
    // },[GTLJC_params.t])


    const [GTLJC_routeCoords, GTLJC_setRouteCoords] = React.useState(null);
    const GTLJC_origin = {latitude : 7.3775, longitude : 3.9470}
    const GTLJC_destination = {latitude : 7.3875, longitude : 3.9570}

    const GTLJC_getRoute = async () => {
      const GTLJC_apiKey = "AIzaSyBYXMiz3S9-vbA9CxSx1sCLTBDba2wZwmY";
      const GTLJC_url = `https://maps.googleapis.com/maps/api/directions/json?origin=${GTLJC_origin.latitude},${GTLJC_origin.longitude}&destination=${GTLJC_destination.latitude},${GTLJC_destination.longitude}&mode=driving&key=${GTLJC_apiKey}`;


      try{
        const GTLJC_response = await  fetch(GTLJC_url)  // .catch(err=>console.log("GTLJC Error: " +))
        const GTLJC_json = await GTLJC_response.json();
        console.log("Gracious received data : " + JSON.stringify(GTLJC_json) );
        const GTLJC_points = await Polyline.decode(GTLJC_json.routes[0] && GTLJC_json.routes[0].overview_polyline.points);
        const GTLJC_coords = GTLJC_points.map(([latitude, longitude])=> ({latitude, longitude}));
        GTLJC_setRouteCoords(GTLJC_coords);
        console.log(GTLJC_routeCoords);
      }
      catch(err){
        console.log("Gracious error fetching directions: ", err)
      }

    }

    const [isFocused, setIsFocused] = useState(false);

    useFocusEffect(
      useCallback(() => {
        GTLJC_setAnomalyInIndex(0);

        setTimeout(()=>{
          console.log("🔁 Screen focused: rerunning everything");
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

            // GTLJC_getDataIn();

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
                      longitude :   GTLJC_userLocation.longitude
                    },
                    title : "User Current Location ",
                    snippet : "User Current Location",
                    draggable : true,
                    // showCallout : true,
                    icon :GTLJC_icons.user,
                    // mapToolbarEnabled : false

                  },
                  // ...GTLJC_inDataMapped
       
                ])

                // console.log("Gracious user location: " + GTLJC_userLocation.latitude)
            }        

            return () => {
              console.log("👋 Unfocused, cleanup if needed");
              setIsFocused(false);
            };

        },3000)
        

      }, [])
    );

    const GTLJC_icons = {
      smooth : GTLJC_smoothroadIcon,
      crack : GTLJC_crackIcon,
      pothole_mild : GTLJC_potholeIcon,
      pothole_severe : GTLJC_potholeIcon,
      bump : GTLJC_bumpIcon,
      "road-patch" : GTLJC_roadPatchIcon,
      user : GTLJC_userLocationIcon
    };

    const GTLJC_icon_urls = {
      smooth : (require("../../assets/images/smooth_FORCHRIST.jpg")),
      pothole_mild : (require("../../assets/images/pothole_FORCHRIST.jpg")),
      crack : (require("../../assets/images/crack_FORCHRIST.jpg")),
      bump: (require("../../assets/images/bump_FORCHRIST.jpg")),
      "road-patch" : (require("../../assets/images/road_patch_FORCHRISTALONE.png")),
      user : (require("../../assets/images/user_loc_FORCHRISTALONE.png"))
    }
 
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
    const [GTLJC_inData_info, GTLJC_setInDataInfo] = React.useState([])    
    const [GTLJC_repeatDet, GTLJC_setRepeatTimer] = React.useState(0)
    const [subscription, setSubscription] = useState(null);
    const [subscription_gyr, setSubscription_gyr] = useState(null);

 

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
                GTLJC_zData, GTLJC_setZData,
                GTLJC_accelRef, GTLJC_gyroRef,
                GTLJC_sampleRate, GTLJC_setSampleRate,
                GTLJC_latitudeRef, GTLJC_longitudeRef,
                GTLJC_speedRef, GTLJC_gpsAccuracyRef           


            } = useSensor();

  
  Accelerometer.setUpdateInterval(GTLJC_sampleRate - 10);
  Gyroscope.setUpdateInterval(GTLJC_sampleRate - 15);

  const _subscribe = () => {
  setSubscription(Accelerometer.addListener( accelerometerData =>
    {
      const GTLJC_v = {
        acc_x: accelerometerData.x * 9.81, 
        acc_y: accelerometerData.y * 9.81, 
        acc_z: accelerometerData.z * 9.81 
      };
      GTLJC_accelRef.current = GTLJC_v;
      GTLJC_setAcceleration(GTLJC_v);
  }
    
    ));
    setSubscription_gyr(
      Gyroscope.addListener(gyroScopeData =>
      {

       const GTLJC_v = {
        rot_x: gyroScopeData.x * 9.81, 
        rot_y: gyroScopeData.y * 9.81, 
        rot_z: gyroScopeData.z * 9.81 
      };
      GTLJC_gyroRef.current = GTLJC_v;
        GTLJC_setRotation(GTLJC_v)
    }
    
    ));

    
  };

  
  const _unsubscribe = () => {
    subscription && subscription.remove();
    subscription_gyr && subscription_gyr.remove();
    setSubscription(null);
    setSubscription_gyr(null);
  };



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
                      longitude :   GTLJC_userLocation.longitude
                    },
                    title : "User Current Location ",
                    snippet : "User Current Location",
                    draggable : true,
                    // showCallout : true,
                    icon :GTLJC_icons.user,
                    // mapToolbarEnabled : false

                  },
                  ...GTLJC_inDataMapped
       
                ])

                // console.log("Gracious user location: " + GTLJC_userLocation.latitude)
            }         
            

        }
  ,[GTLJC_rotation.rot_x])

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
          timeInterval : 500,
          distanceInterval : 0 // To graciously update regardless of movement
        },
        (GTLJC_newLocation)=>{
          //     ref.current?.setCameraPosition({
          //     coordinates :{
          //       latitude : GTLJC_newLocation.coords.latitude,
          //       longitude : GTLJC_newLocation.coords.longitude
          //   },
          //     zoom :10,
          // });
          GTLJC_speedRef.current = GTLJC_newLocation.coords.speed;
          GTLJC_latitudeRef.current = GTLJC_newLocation.coords.latitude;
          GTLJC_longitudeRef.current = GTLJC_newLocation.coords.longitude;
          GTLJC_gpsAccuracyRef.current = GTLJC_newLocation.coords.accuracy;
          

          GTLJC_setSpeed(GTLJC_newLocation.coords.speed);
          GTLJC_setLatitude(GTLJC_newLocation.coords.latitude);
          GTLJC_setLongitude(GTLJC_newLocation.coords.longitude);
          GTLJC_setAccuracy(GTLJC_newLocation.coords.accuracy);
          
          GTLJC_setUserLocation(GTLJC_newLocation.coords)

          console.log(GTLJC_newLocation.coords);
          // console.log(ref)
        }     
      )  

    }

    GTLJC_startLocationUpdates();

    return ()=>{
      if (GTLJC_subscription){
        GTLJC_subscription.remove();
      }
    };
  },
  [
    GTLJC_accelRef.acc_x, 
    GTLJC_accelRef.acc_y, 
    
  
  ]
)


const GTLJC_getDataIn = async ()=>{

    GTLJC_setRepeatTimer(GTLJC_prev=>GTLJC_prev + 1);
    const GTLJC_res = await fetch("https://roadanomaly4christalone.roadanomalyforchrist.pythonanywhere.com/api-road-in/road_anomaly_in/").catch(err=>console.log(err))
    const GTLJC_resJson = await GTLJC_res.json()
    GTLJC_setInData(GTLJC_resJson)

    const GTLJC_inDataInfoStructure = GTLJC_inData && GTLJC_inData.map((GTLJC_item)=>({
      anomaly :"Anomaly : ".toUpperCase() + GTLJC_item.anomaly + " ==>",
      distanceToAnomaly : "xxxx",
      timeToReachAnomaly : "xxxx",
      latitude : GTLJC_item.latitude,
      longitude : GTLJC_item.longitude,
      location : "xxxx",
      icon_url : GTLJC_icon_urls[GTLJC_item.anomaly],
    }))
    GTLJC_setInDataInfo([
      {
        anomaly : "User Location" + " (next) ==>" ,
        distanceToAnomaly : "0",
        timeToReachAnomaly : "0",
        latitude : GTLJC_userLocation && GTLJC_userLocation.latitude,
        longitude : GTLJC_userLocation &&  GTLJC_userLocation.longitude,
        location : "xxxx",
        icon_url : GTLJC_icon_urls.user
    }, 
      ...GTLJC_inDataInfoStructure
    ])
    // console.log(GTLJC_resJson)
  }

 

  const [GTLJC_sendData, GTLJC_setSendData] = React.useState(true);

  useEffect(() => {
    _subscribe();
    GTLJC_getDataIn();
   return () => _unsubscribe();
  }, [GTLJC_rotation.rot_x]);
    
  const [GTLJC_anomalyInIndex, GTLJC_setAnomalyInIndex] = React.useState(0);
 
  function GTLJC_handleChangeWithRef(){

    GTLJC_setAnomalyInIndex((GTLJC_prev)=>{
      if(GTLJC_inData_info){
        console.log("Gracious anomaly" + GTLJC_anomalyInIndex);
        return GTLJC_prev < GTLJC_inData_info.length - 1 ? GTLJC_prev + 1 : 0
      }
      // return GTLJC_prev
    })
   
    const GTLJC_nextLocation = GTLJC_inData_info && GTLJC_inData_info[GTLJC_anomalyInIndex];

    // Graciously setting camera first to ensure animation happens
    ref.current?.setCameraPosition({
        coordinates : {
            latitude:GTLJC_inData_info &&  GTLJC_inData_info[(GTLJC_anomalyInIndex ==( GTLJC_inData_info.length - 1))?0:GTLJC_anomalyInIndex + 1].latitude,
            longitude : GTLJC_inData_info && GTLJC_inData_info[(GTLJC_anomalyInIndex ==( GTLJC_inData_info.length - 1))?0:GTLJC_anomalyInIndex + 1].longitude,
        },

        zoom : 19,
    });
    console.log(ref)
    console.log("Gracious anomaly" + GTLJC_anomalyInIndex)

    GTLJC_getRoute();

    // Graciously update state after animation is triggered
    // GTLJC_setLocationIndex(GTLJC_newIndex)


  }

  const  GTLJC_seeUserLocation = ()=>{
     ref.current?.setCameraPosition({
        coordinates : {
            latitude:  GTLJC_userLocation &&  GTLJC_userLocation.latitude,
            longitude : GTLJC_userLocation && GTLJC_userLocation.longitude 
        },

        zoom : 20,
    });
  }

  const GTLJC_renderMapControls = () => {

      return(
            <>
          <View style = {{flex : 8}}  pointerEvents="none" />

          <View style = {styles.controlsContainer} pointerEvents="auto">
              {/* 1 */}
              <TouchableOpacity
                style = {
                  {
                    backgroundColor : "lightblue",
                    padding : 20,
                    borderRadius : 20,
                    
                   
                  }
                }

                onPress={()=> GTLJC_seeUserLocation()}
              >
                <Text style = {{
                    color : "#212121",
                    fontWeight : 900,
                    fontStyle : "italic"
                  }}>
                     User Location
                </Text>
                <Image
                    source={GTLJC_inData_info[0] && GTLJC_inData_info[0].icon_url} 
                    style = {{height : 20, width : 20, alignSelf : "center", marginTop : 5}}
                    
                  />
              </TouchableOpacity>


               <TouchableOpacity
                style = {
                  {
                    backgroundColor : "skyblue",
                    padding : 20,
                    borderRadius : 20,
                    marginTop : 15,
                    display : "flex",
                    justifyContent : "center",
                    alignContent : "center"
                   
                  }
                }

                onPress={()=> GTLJC_handleChangeWithRef()}
              >
                <Text style = {{
                    color : "#2222bb",
                    fontWeight : 900,
                    fontStyle : "italic"
                  }}>
                      {GTLJC_inData_info[GTLJC_anomalyInIndex] && GTLJC_inData_info[GTLJC_anomalyInIndex].anomaly } 
                     {/* <Ionicons name = "ion-arrow-right-a" size = {21} color= "white" /> */}
                </Text>
                <Image
                  
                />
                
                  <Image
                    source={GTLJC_inData_info[GTLJC_anomalyInIndex] && GTLJC_inData_info[GTLJC_anomalyInIndex].icon_url} 
                    style = {{height : 20, width : 20, alignSelf : "center", marginTop : 5}}
                    
                  />

                  <Text style = {{
                    color : "#2222bb",
                    fontWeight : 900,
                    fontStyle : "italic"
                  }}>
                      Distance To : {GTLJC_inData_info[GTLJC_anomalyInIndex] && GTLJC_inData_info[GTLJC_anomalyInIndex].distanceToAnomaly} 
                     
                </Text>

                <Text style = {{
                    color : "#2222bb",
                    fontWeight : 900,
                    fontStyle : "italic"
                  }}>
                      Time : {GTLJC_inData_info[GTLJC_anomalyInIndex] && GTLJC_inData_info[GTLJC_anomalyInIndex].timeToReachAnomaly} 
                     
                </Text>
        
              </TouchableOpacity>
                

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
              <StatusBar
                  backgroundColor="transparent"
                  barStyle="dark-content"
                  translucent = {true}
              />
              <GoogleMaps.View
                  style = {StyleSheet.absoluteFill}
                  cameraPosition = {GTLJC_cameraPosition}
                  ref={ref}
                  markers = {GTLJC_markersGoogle}
                  polylines={[
                    {
                      color : "blue",
                      coordinates : [
                        {
                          latitude : GTLJC_userLocation && GTLJC_userLocation.latitude,
                          longitude : GTLJC_userLocation && GTLJC_userLocation.longitude
                        },
                        {
                          latitude : GTLJC_inData_info[GTLJC_anomalyInIndex] && GTLJC_inData_info[GTLJC_anomalyInIndex].latitude,
                          longitude : GTLJC_inData_info[GTLJC_anomalyInIndex] && GTLJC_inData_info[GTLJC_anomalyInIndex].longitude,
                          
                        }
                      ],
                      width : 10,
                      // geodesic : true
                    }
                  ]}

                  properties={{
                      mapType : GoogleMapsMapType.NORMAL,
                      isBuildingEnabled : true,
                      isIndoorEnabled : true,
                      // isMyLocationEnabled : true, // Graciously requires location permission
                      selectionEnabled: true,
                      isTrafficEnabled: true,
                      // minZoomPreference: 21,
                      // maxZoomPreference: 20,
                    }}

                    userLocation={{
                      followUserLocation : true,
                      // coordinates : 
                    }}

                    uiSettings={{
                      zoomControlsEnabled : true,
                      myLocationButtonEnabled : false,
                      compassEnabled : false,
                      mapToolbarEnabled : false,
                      zoomControlsEnabled : false,
                      
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
    backgroundColor: "rgba(114, 47, 55, 1)",
    paddingBottom : 20,
    minHeight : 50
  },
});


function GTLJC_setUserMarker(){
  if (GTLJC_userLocationGlobal){
    return GTLJC_userLocationGlobal.coordinates
  }

  return  { latitude: 49.268034, longitude: -123.154819 }
}

const GTLJC_polylineCoordinates = [
  { latitude: 33.8121, longitude: -117.919 }, // Disneyland
  { latitude: 33.837, longitude: -117.912 },

  
];




    