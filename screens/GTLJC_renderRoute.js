import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GOOGLE_MAPS_APIKEY = "YOUR_GOOGLE_MAPS_API_KEY";

export default function GTLJC_renderRoute() {
  const [modalVisible, setModalVisible] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showRoute, setShowRoute] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 6.5244,
          longitude: 3.3792,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {origin && <Marker coordinate={origin} title="Origin" />}
        {destination && <Marker coordinate={destination} title="Destination" />}

        {origin && destination && showRoute && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>

      {/* Floating Button to open modal */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="locate" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Toggle Route Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { top: 70 }]}
        onPress={() => setShowRoute((prev) => !prev)}
      >
        <Ionicons name={showRoute ? "eye-off" : "eye"} size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal for Places Autocomplete */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Locations</Text>

            <GooglePlacesAutocomplete
              placeholder="Search Origin"
              onPress={(data, details = null) => {
                const loc = details.geometry.location;
                setOrigin({ latitude: loc.lat, longitude: loc.lng });
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: "en",
              }}
              fetchDetails={true}
              styles={{
                textInput: styles.input,
                container: { flex: 0, marginBottom: 10 },
              }}
            />

            <GooglePlacesAutocomplete
              placeholder="Search Destination"
              onPress={(data, details = null) => {
                const loc = details.geometry.location;
                setDestination({ latitude: loc.lat, longitude: loc.lng });
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: "en",
              }}
              fetchDetails={true}
              styles={{
                textInput: styles.input,
                container: { flex: 0, marginBottom: 10 },
              }}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Show Route</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#b03613",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#b03613",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});
