// ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useSensor } from "../../components/GTLJC_SensorContext";

const API_PREDICTION_OUTPUT = "https://roadanomaly4christalone.pythonanywhere.com/api-road-prediction-output/road_anomaly_predict/";
const API_VERIFICATION = "https://roadanomaly4christalone.pythonanywhere.com/api-road-verification/road_anomaly_verify/";
const API_INFERENCE = "https://roadanomaly4christalone.pythonanywhere.com/api-road-inference-logs/road_anomaly_infer/";

export default function GTLJC_TabPredict() {

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
  
  const [predictions, setPredictions] = useState([]);
  const [logData, setLogData] = useState([]);
  const [collecting, setCollecting] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);
  const [showGetPredictionsButton, setShowGetPredictionsButton] = useState(false);
  const [verifying, setVerifying] = useState(null);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  const collectStreamingData = () => {
    if (collecting) return;
    setCollecting(true);
    let counter = 0;
    const interval = setInterval(() => {
      if (counter >= 60) {
        clearInterval(interval);
        setCollecting(false);
        setShowSendButton(true);
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

      };
      setLogData(prev => [...prev, entry]);
      GTLJC_setCounter(prev => prev + 1);
      GTLJC_setIntervalMilli((new Date()).getTime());
      GTLJC_setDate(new Date().toISOString());

      counter++;
    }, GTLJC_sampleRate);
  };

  const sendInferenceData = async () => {
    try {
      await fetch(API_INFERENCE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });
      setShowSendButton(false);
      setTimeout(() => setShowGetPredictionsButton(true), 3000);
    } catch (err) {
      console.error("❌ Failed to send inference data:", err);
    }
  };

  const fetchPredictions = () => {
    setLoadingPredictions(true);
    fetch(API_PREDICTION_OUTPUT)
      .then(res => res.json())
      .then(data => {
        setPredictions(data);
        setShowGetPredictionsButton(false);
      })
      .catch(err => console.error("🚫 Failed to fetch predictions:", err))
      .finally(() => setLoadingPredictions(false));
  };

  const verifyPrediction = async (item, response) => {
    setVerifying(item.id);
    try {
      await fetch(API_VERIFICATION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          anomaly_prediction: item.anomaly_prediction,
          response,
        }),
      });
      setPredictions(prev => prev.filter(p => p.id !== item.id));
    } catch (err) {
      console.error("❌ Error sending verification:", err);
    } finally {
      setVerifying(null);
    }
  };

  const renderPrediction = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>📍 Location: {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</Text>
      <Text style={styles.cardText}>🌀 Prediction: {item.anomaly_prediction}</Text>
      <Text style={styles.cardText}>🕒 Time: {new Date(item.timestamp).toLocaleTimeString()}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#28a745" }]}
          onPress={() => verifyPrediction(item, "YES")}
          disabled={verifying === item.id}
        >
          <Feather name="check-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#dc3545" }]}
          onPress={() => verifyPrediction(item, "NO")}
          disabled={verifying === item.id}
        >
          <Feather name="x-circle" size={20} color="white" />
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🔄 Predict Road Anomalies</Text>

      {!collecting && !showSendButton && !showGetPredictionsButton && (
        <TouchableOpacity style={styles.actionBtn} onPress={collectStreamingData}>
          <Feather name="activity" size={20} color="white" />
          <Text style={styles.buttonText}>Collect Streaming Logs</Text>
        </TouchableOpacity>
      )}

      {showSendButton && (
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#007bff" }]} onPress={sendInferenceData}>
          <Feather name="send" size={20} color="white" />
          <Text style={styles.buttonText}>Send Inference Data</Text>
        </TouchableOpacity>
      )}

      {showGetPredictionsButton && (
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#6f42c1" }]} onPress={fetchPredictions}>
          <Feather name="download" size={20} color="white" />
          <Text style={styles.buttonText}>Get Predictions</Text>
        </TouchableOpacity>
      )}

      {loadingPredictions && <ActivityIndicator size="large" color="#444" />}

      {predictions.length > 0 && (
        <FlatList
          data={predictions}
          keyExtractor={item => item.id.toString()}
          renderItem={renderPrediction}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f3f3f3",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  actionBtn: {
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
  }
});
