// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE
import React, { useRef } from "react";
import { Alert, Button, StyleSheet, View, Text, Platform } from "react-native";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { GTLJC_locationList } from "../GTLJC_LocationList";
// import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native";
import {useBottomTabOverflow} from "../components/ui/TabBarBackground"
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
import { coolDownAsync } from "expo-web-browser";
import * as Location from "expo-location"
import Geolocation from "react-native-geolocation-service"


const GTLJC_SF_ZOOM = 12;

export default function GTLJC_RootIndex(){
    const GTLJC_bottom = useBottomTabOverflow();
    const [GTLJC_locationIndex, GTLJC_setLocationIndex] = React.useState(0)
    const ref =  React.useRef(null)
    const [GTLJC_userLocation, GTLJC_setUserLocation] = React.useState(null);
    const [GTLJC_permission, GTLJC_setPermission] = React.useState(null);
    const [GTLJC_cameraPosition, GTLJC_setCameraPosition] = React.useState({
      coordinates : {
        latitude : 31.771959,
        longitude : 35.217018
      }
    })

    function GTLJC_GoogleMapsView(){
      return ""
    }
    React.useEffect(()=>{
      // setTimeout(
        // ()=>{
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
              }
            })
          }

          GTLJC_getLocation();
        // },2000)      

    },[])

  

  // GTLJC_getLocationUpdates();
           
    // const GTLJC_cameraPosition = {
    //     coordinates : {
    //         // latitude : GTLJC_locationList[0].stores[0].point[0],
    //         latitude : 33.8121,
    //         // longitude : GTLJC_locationList[0].stores[0].point[1],
    //         longitude : -117.919
    //     },
    //     zoom : 10,
    // }




    function GTLJC_handleChangeWithRef(GTLJC_direction){
        console.log(GTLJC_direction);
        const GTLJC_newIndex = GTLJC_locationIndex + (GTLJC_direction == "gtljc_next" ? 1 : -1)
        console.log(GTLJC_newIndex)
        const GTLJC_nextLocation = GTLJC_locationList[GTLJC_newIndex];

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
    // setInterval(
    //     GTLJC_handleChangeWithRef,2000
    // )
    const GTLJC_renderMapControls = () => {

        return(
             <>
            <View style = {{flex : 8}}  pointerEvents="none" />

            <View style = {styles.controlsContainer} pointerEvents="auto">
                {/* 1 */}
                <Button title = "GTLJC_Prev" onPress = {() => GTLJC_handleChangeWithRef("gtljc_prev")} />
                <Button title = "GTLJC_Next" onPress = {()=> GTLJC_handleChangeWithRef("gtljc_next")} />

                {/* 2 */}
                {/* <Button 
                    title = "Graciously set random"
                    onPress = {()=>
                        ref.current ?. GTLJC_setCameraPosition({
                            coordinates : {
                                latitude: Math.random() * 360 - 180,
                                longitude : Math.random() * 360 -180
                            },

                            zoom : 1,
                        })
                    }

                /> */}
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

                    // uiSettings={{
                    //   zoomControlsEnabled : true,
                    //   // myLocationButtonEnabled : true,
                    //   compassEnabled : true
                    // }}

                    onPolylineClick={(event) => {
                      console.log(event);
                      Alert.alert("Polyline clicked", JSON.stringify(event));
                    }}
                    onMapLoaded={() => {
                      console.log(JSON.stringify({ type: "onMapLoaded" }, null, 2));
                    }}
                    onMapClick={(e) => {
                      console.log(
                        JSON.stringify({ type: "onMapClick", data: e }, null, 2)
                      );
                    }}
                    onMapLongClick={(e) => {
                      console.log(
                        JSON.stringify({ type: "onMapLongClick", data: e }, null, 2)
                      );
                    }}
                    onPOIClick={(e) => {
                      console.log(
                        JSON.stringify({ type: "onPOIClick", data: e }, null, 2)
                      );
                    }}
                    onMarkerClick={(e) => {
                      console.log(
                        JSON.stringify({ type: "onMarkerClick", data: e }, null, 2)
                      );
                    }}
                    onCameraMove={(e) => {
                      console.log(
                        JSON.stringify({ type: "onCameraMove", data: e }, null, 2)
                      );
                    }}
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

const GTLJC_markersGoogle = [
  {
    coordinates: { latitude: 49.259133, longitude: -123.10079 },
    // title: "49th Parallel Café & Lucky's Doughnuts - Main Street",
    snippet: "49th Parallel Café & Lucky's Doughnuts - Main Street",
    draggable: true,
    // icon: 
  },
  {
    coordinates: { latitude: 49.268034, longitude: -123.154819 },
    // title: "49th Parallel Café & Lucky's Doughnuts - 4th Ave",
    snippet: "49th Parallel Café & Lucky's Doughnuts - 4th Ave",
    draggable: true,
  },
  {
    coordinates: { latitude: 49.286036, longitude: -123.12303 },
    // title: "49th Parallel Café & Lucky's Doughnuts - Thurlow",
    snippet: "49th Parallel Café & Lucky's Doughnuts - Thurlow",
    draggable: true,
  },
  {
    coordinates: { latitude: 49.311879, longitude: -123.079241 },
    // title: "49th Parallel Café & Lucky's Doughnuts - Lonsdale",
    snippet: "49th Parallel Café & Lucky's Doughnuts - Lonsdale",
    draggable: true,
  },
  {
    coordinates: {
      latitude: 49.27235336018808,
      longitude: -123.13455838338278,
    },
    // title: "A La Mode Pie Café - Granville Island",
    snippet: "A La Mode Pie Café - Granville Island",
    draggable: true,
    
  },
];

const markersApple = [
  {
    coordinates: { latitude: 49.259133, longitude: -123.10079 },
    title: "49th Parallel Café & Lucky's Doughnuts - Main Street",
    tintColor: "brown",
    systemImage: "cup.and.saucer.fill",
  },
  {
    coordinates: { latitude: 49.268034, longitude: -123.154819 },
    title: "49th Parallel Café & Lucky's Doughnuts - 4th Ave",
    tintColor: "brown",
    systemImage: "cup.and.saucer.fill",
  },
  {
    coordinates: { latitude: 49.286036, longitude: -123.12303 },
    title: "49th Parallel Café & Lucky's Doughnuts - Thurlow",
    tintColor: "brown",
    systemImage: "cup.and.saucer.fill",
  },
  {
    coordinates: { latitude: 49.311879, longitude: -123.079241 },
    title: "49th Parallel Café & Lucky's Doughnuts - Lonsdale",
    tintColor: "brown",
    systemImage: "cup.and.saucer.fill",
  },
  {
    coordinates: {
      latitude: 49.27235336018808,
      longitude: -123.13455838338278,
    },
    title: "A La Mode Pie Café - Granville Island",
    tintColor: "orange",
    systemImage: "fork.knife",
  },
];


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
