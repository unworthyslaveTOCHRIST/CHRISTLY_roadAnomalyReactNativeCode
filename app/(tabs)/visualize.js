// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE
// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useSensor } from "../../components/GTLJC_SensorContext";
import { useFocusEffect } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Accelerometer,Gyroscope } from "expo-sensors";

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
    GTLJC_speedRef, GTLJC_gpsAccuracyRef

  } = useSensor();


  const [logData, setLogData] = useState([]);
  const [isPreparing, setIsPreparing] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);



  const collectAnomalyLogs = () => {
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

      const entry = {
        batch_id: GTLJC_batchId,
        acc_x, acc_y, acc_z,
        rot_x, rot_y, rot_z,
        speed: GTLJC_speed,
        log_interval: counter * GTLJC_sampleRate,
        latitude: GTLJC_latitude,
        longitude: GTLJC_longitude,
        accuracy: GTLJC_accuracy,
        timestamp: new Date().toISOString()
      };
      setLogData(prev => [...prev, entry]);
      GTLJC_setCounter(prev => prev + 1);
      GTLJC_setIntervalMilli((new Date()).getTime());
      GTLJC_setDate(new Date().toISOString());

      counter++;
    }, GTLJC_sampleRate);
  };

  const resetLogs = () => {
    setLogData([]);
    GTLJC_setCounter(0);
    GTLJC_setBatchId(0);
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
      GTLJC_setLogNo((GTLJC_prev)=>GTLJC_prev + 1);
      const fileName = `anomalies_log${(new Date).toISOString()}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;
      const csvContent = formatCSV(logData);
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (sendToServer) {
        await fetch("https://roadanomalyforchrist.pythonanywhere.com/api-road-out/road_anomaly_out/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(logData),
        });
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
    <View style={{ padding: 10 }}>
      <Text>Christly Acceleration: {JSON.stringify(GTLJC_acceleration)}</Text>
      <Text>Christly Rotation: {JSON.stringify(GTLJC_rotation)}</Text>
      <Text>Christly batch id: {GTLJC_batchId}</Text>
      <Text>Christly date: {GTLJC_date}</Text>
      <Text>Christly counter: {GTLJC_counter}</Text>
      <Text>Christly interval: {GTLJC_intervalMilli}</Text>
      <Text>Christly speed: {GTLJC_speedRef.current}</Text>
      <Text>Christly latitude: {GTLJC_latitudeRef.current}</Text>
      <Text>Christly longitude: {GTLJC_longitudeRef.current}</Text>
      <Text>Christly accuracy: {GTLJC_gpsAccuracyRef.current}</Text>
      <Text>Christly Log No: {GTLJC_logNo}</Text> 

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

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={collectAnomalyLogs}>
           <Feather name="activity" size={20} color="white" />
          <Text style={styles.buttonText}>Collect Anomaly</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={resetLogs}>
            <MaterialIcons name="delete" size={18} color="white" />
           
          <Text style={styles.buttonText}>Reset Logs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => shareLogs(true)}>
          <Feather name="send" size={20} color="white" />
          
          <Text style={styles.buttonText}>Share + Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => shareLogs(false)}>
          <MaterialIcons name="share" size={20} color="white" />
          <Text style={styles.buttonText}>Share Only</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "#15bb",
    padding: 12,
    margin: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  }
});

