// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE
// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useSensor } from "../../components/GTLJC_SensorContext";
import { useFocusEffect } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "react-native";

export default function GTLJC_TabVisualize() {
  const {
    GTLJC_acceleration, GTLJC_setAcceleration,
    GTLJC_rotation, GTLJC_setRotation,
    GTLJC_batchId,
    GTLJC_setBatchId,
    GTLJC_date,
    GTLJC_setDate,
    GTLJC_counter,
    GTLJC_setCounter,
    GTLJC_intervalMilli,
    GTLJC_setIntervalMilli,
    GTLJC_speed,
    GTLJC_latitude,
    GTLJC_longitude,
    GTLJC_accuracy,
    GTLJC_accelRef, GTLJC_gyroRef,
    GTLJC_sampleRate, GTLJC_setSampleRate,
    GTLJC_latitudeRef, GTLJC_longitudeRef,
    GTLJC_speedRef, GTLJC_gpsAccuracyRef,
  } = useSensor();


  const [logData, setLogData] = useState([]);
  const [isPreparing, setIsPreparing] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [GTLJC_resetTrigger, GTLJC_setResetTrigger] = useState(false);
  const [GTLJC_data, GTLJC_setData] = useState(null);

  const collectAnomalyLogs = (anomaly = "smooth") => {
    if (collecting) return;
    setCollecting(true);
    let counter = 0;
    const interval = setInterval(() => {
      if (counter >= 60) {
        clearInterval(interval);
        setCollecting(false);
        GTLJC_setCounter(0);
        GTLJC_setBatchId(prev => prev + 1);
        return;
      } 
    

        const { acc_x, acc_y, acc_z } = GTLJC_accelRef.current;
        const { rot_x, rot_y, rot_z } = GTLJC_gyroRef.current;
        const speed     = GTLJC_speedRef.current;
        const latitude  = GTLJC_latitudeRef.current;
        const longitude = GTLJC_longitudeRef.current;
        const accuracy  = GTLJC_gpsAccuracyRef.current;

      const entry = {
        batch_id: GTLJC_batchId,
        acc_x, acc_y, acc_z,
        rot_x, rot_y, rot_z,
        speed,
        log_interval: counter * GTLJC_sampleRate,
        latitude,
        longitude,
        accuracy,
        timestamp: new Date().toISOString(),
        anomaly
      };
      setLogData(prev => [...prev, entry]);
      GTLJC_setCounter(prev => prev + 1);
      GTLJC_setIntervalMilli((new Date()).getTime());
      GTLJC_setDate(new Date().toISOString());

      counter++;
    }, GTLJC_sampleRate);
  };

  const resetLogs = () => {
    GTLJC_setResetTrigger(true)
    setLogData([]);
    GTLJC_setCounter(0);
    GTLJC_setBatchId(0);
    if (GTLJC_setResetTrigger) setTimeout(()=>{GTLJC_setResetTrigger(false);},6000);
  };

 
  

  const formatCSV = (data) => {
    const headers = Object.keys(data[0] || {}).join(",");
    const rows = data.map(entry => Object.values(entry).join(",")).join("\n");
    return `${headers}\n${rows}`;
  };

  const [GTLJC_logNo, GTLJC_setLogNo] = useState(1);
  const shareLogs = async (sendToServer = false) => {
    try {
      setIsPreparing(true);
      const fileName = `anomalies_log${(new Date).toISOString()}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;
      const csvContent = formatCSV(logData);
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (sendToServer) {
        await fetch("https://roadanomaly4christalone.pythonanywhere.com/api-road-inference-logs/road_anomaly_infer/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(logData),
        }).then(res=>console.log("Gracious response returned: " + JSON.stringify(res.json()) ));
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        console.warn("Sharing not available on this platform.");
      }
    } catch (err) {
      console.error("❌ Error sharing or sending data:", err.message);
    } finally {
      setIsPreparing(false);
    }
  };

    

  return (
    <SafeAreaView  style={{ padding: 10 }}>
      
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        {/* 📈 Acceleration & Rotation Dashboard */}
        <View style={{
          flex: 1,
          backgroundColor: "#111",
          borderRadius: 10,
          padding: 10,
          marginRight: 5
        }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            📈 Acceleration (m/s²)
          </Text>
          {["x", "y", "z"].map(axis => {
            const val = GTLJC_acceleration[`acc_${axis}`];
            const all = [
              GTLJC_acceleration.acc_x,
              GTLJC_acceleration.acc_y,
              GTLJC_acceleration.acc_z,
            ];
            const sorted = [...all].sort((a, b) => a - b);
            const annotation = val === sorted[0] ? "📉 Lowest" : val === sorted[2] ? "📈 Highest" : "↔️ Middle";
            return (
              <Text key={axis} style={{ color: "#6EC1E4", marginLeft: 10 }}>
                {`• ${axis.toUpperCase()}: ${val?.toFixed(4)}  ${annotation}`}
              </Text>
            );
          })}

          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginTop: 12 }}>
            🔁 Rotation (rad/s)
          </Text>
          {["x", "y", "z"].map(axis => {
            const val = GTLJC_rotation[`rot_${axis}`];
            const all = [
              GTLJC_rotation.rot_x,
              GTLJC_rotation.rot_y,
              GTLJC_rotation.rot_z,
            ];
            const sorted = [...all].sort((a, b) => a - b);
            const annotation = val === sorted[0] ? "📉 Lowest" : val === sorted[2] ? "📈 Highest" : "↔️ Middle";
            return (
              <Text key={axis} style={{ color: "#ABEBC6", marginLeft: 10 }}>
                {`• ${axis.toUpperCase()}: ${val?.toFixed(4)}  ${annotation}`}
              </Text>
            );
          })}
        </View>

        {/* 📡 Meta + GPS Info Dashboard */}
        <View style={{
          flex: 1,
          backgroundColor: "#222",
          borderRadius: 10,
          padding: 10,
          marginLeft: 5
        }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            🗂️ Log Info
          </Text>
          <Text style={{ color: "#ddd", marginVertical: 2 }}>
            📦 Batch ID: <Text style={{ color: "white" }}>{GTLJC_batchId}</Text>
          </Text>

          <Text style={{ color: "#ddd", marginVertical: 2 }}>
            🧮 Counter: <Text style={{ color: "white" }}>{GTLJC_counter}</Text>
          </Text>

          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 6 }}>
            📡 GPS Info
          </Text>
          <Text style={{ color: "#ccc", marginVertical: 2 }}>
            🚀 Speed: <Text style={{ color: "white" }}>{GTLJC_speedRef.current?.toFixed(2)} m/s</Text>
          </Text>
          <Text style={{ color: "#ccc", marginVertical: 2 }}>
            📍 Latitude: <Text style={{ color: "white" }}>{GTLJC_latitudeRef.current}</Text>
          </Text>
          <Text style={{ color: "#ccc", marginVertical: 2 }}>
            📍 Longitude: <Text style={{ color: "white" }}>{GTLJC_longitudeRef.current}</Text>
          </Text>
          <Text style={{ color: "#ccc", marginVertical: 2 }}>
            📶 Accuracy: <Text style={{ color: "white" }}>{GTLJC_gpsAccuracyRef.current}</Text>
          </Text>
        </View>
      </View>

        {/*For Gracious Controls */}
      {isPreparing && (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="small" color="blue" />
          <Text style={{ textAlign: "center", color: "gray" }}>
            Preparing to share...
          </Text>
        </View>
      )}

      {collecting && (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="small" color="orange" />
          <Text style={{ textAlign: "center", color: "orange" }}>
            Collecting 60 readings...
          </Text>
        </View>
      )}
    
    {GTLJC_resetTrigger && (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="small" color="#aaaaaa" />
          <Text style={{ textAlign: "center", color: "#aaaaaa" }}>
            Resetting logs
          </Text>
        </View>
      )}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={()=>collectAnomalyLogs("smooth-road")}>
           <FontAwesome5 name="road" size={20} color="white" />
          <Text style={styles.buttonText}>Smooth Road?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={()=>collectAnomalyLogs("cracked-road")}>
           <MaterialCommunityIcons name="format-line-style" size={20} color="white" />
          <Text style={styles.buttonText}>Cracked Road?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={()=>collectAnomalyLogs("bump")}>
           <MaterialIcons name="terrain" size={20} color="white" />
          <Text style={styles.buttonText}>Bump?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={()=>collectAnomalyLogs("road-patch")}>
           <MaterialCommunityIcons name="layers-triple-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Road-Patch?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={()=>collectAnomalyLogs("pothole-mild")}>
           <FontAwesome name="dot-circle-o" size={20} color="white" />
          <Text style={styles.buttonText}>Mild Pothole?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={()=>collectAnomalyLogs("pothole-severe")}>
           <MaterialCommunityIcons name="alert-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Severe Pothole?</Text>
        </TouchableOpacity>
      </View>

    <View style={styles.row}>
        <TouchableOpacity style={{...styles.button,backgroundColor : "#112233"}} onPress={resetLogs}>
            <MaterialIcons name="delete" size={18} color="white" />
           
          <Text style={styles.buttonText}>Reset Logs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={{...styles.button, backgroundColor : "#9f3acf"}} onPress={() => shareLogs(true)}>
          <Feather name="send" size={20} color="white" />
          
          <Text style={styles.buttonText}>Share + Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{...styles.button, backgroundColor : "#9f3acf"}} onPress={() => shareLogs(false)}>
          <MaterialIcons name="share" size={20} color="white" />
          <Text style={styles.buttonText}>Share Only</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "#15bb",
    padding: 10,
    margin: 7,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
    
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2
  }
});

