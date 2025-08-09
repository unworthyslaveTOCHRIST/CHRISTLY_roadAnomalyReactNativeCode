//ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE
// import React from "react";
import {View, StyleSheet, Text} from "react-native"
import {Stack} from "expo-router"
import { Ionicons } from "@expo/vector-icons";

export default function GTLJC_RootLayout(){
    return(
        <Stack>
            {/* <Stack.Screen name = "index" options = {{title : "Locate Anomaly"}} />      */}
            <Stack.Screen name = "(tabs)" options = {{headerShown : false}} />      
        </Stack>
    )
}