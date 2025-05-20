// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

import { FontAwesome } from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import useBottomTabOverflow from "../../components/ui/TabBarBackground";

export default function GTLJC_TabLayout(){
    return(
        <Tabs
            screenOptions={{
                tabBarActiveTintColor : "blue"
            }}
        >
            <Tabs.Screen
                name = "index"
                options = {{
                    title : "Find Anomaly",
                    // tabBarIcon : ({color}) => <FontAwesome size = {28} name = "home" color = {color} />
                }}
            />

            <Tabs.Screen
                name = "visualize"
                options = {{
                    title : "Collect Anomaly Data",
                    // tabBarIcon : ({color}) => <FontAwesome size = {28} name = "home" color = {color} />
                }}
            />
            <Tabs.Screen
                name = "predict"
                options = {{
                    title : "Find Anomaly",
                    tabBarIcon : ({color}) => <FontAwesome size = {28} name = "home" color = {color} />
                }}
            />

        </Tabs>
    )
}