// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

import { FontAwesome } from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";

import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

import { GTLJC_SensorProvider } from "../../components/GTLJC_SensorContext";
import {View, Text} from "react-native"


export default function GTLJC_TabLayout(){

    const GTLJC_router = useRouter();
    
    return(
       
        <GTLJC_SensorProvider>
        
        <Tabs
            screenOptions={{
                tabBarActiveTintColor : "#b03613",
                // tabBarShowLabel : false,
                    tabBarStyle: {
                        display : "none",
                        height: 65,
                    // position: "absolute",
                },
            }}
            
        >
            <Tabs.Screen
                name = "index"
                options={{
                    title : "Find Anomaly",
                    // tabBarIcon : ({color}) => <FontAwesome size = {28} name = "home" color = {color} />,
                    tabBarIcon : ({color, focused}) => <Ionicons name = "location" color = {color} size = {focused ? 25: 20}/>,
                    headerTitle: () => (
                        <View
                            style = {{
                                flexDirection : 'row',
                                alignItems   : "center",
                            }}
                        >
                            <Ionicons name = "location" color = {"#b03613"} size = {22} style = {{marginRight : 8}}/>
                            <Text style = {{fontSize : 18, fontWeight: 'bold', color: "#333"}}>Find Anomaly</Text>
                        </View>
                    )
                    
                
                }}
                
               
                
            />

            {/* <Tabs.Screen
                name = "visualize"
                options={{
                    title : "Collect Anomaly Data",
                    tabBarIcon : ({color, focused}) => <Ionicons name = "create" color = {color} size = {focused ? 25: 20}/>
                }}
            />

            <Tabs.Screen
                name = "predict"
                options={{
                    title : "Real Time Predictions",
                    tabBarIcon : ({color, focused}) => <Ionicons name = "pulse" color = {color} size = {focused ? 25: 20}/>
                }}
            /> */}

            </Tabs>
        </GTLJC_SensorProvider>
        
 
       
    )
}