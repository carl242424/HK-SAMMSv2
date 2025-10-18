import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import QRCheckIn from "./QRCheckIn"; // Make sure this path is correct

const PRIMARY_COLOR = "#00A4DF";

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarcodeScanned = ({ data }) => {
    console.log("Raw QR data:", data); // Debug log
    try {
      const parsed = JSON.parse(data); // Expects structured JSON from QR
      setIsSaving(true);

      // Simulate processing time
      setTimeout(() => {
        setScannedData(parsed);
        setIsSaving(false);
        Alert.alert("✅ QR Scanned", `${parsed.studentName || "Unknown"} detected.`);
      }, 1000);
    } catch (error) {
      console.log("QR parse error:", error);
      Alert.alert("⚠️ Invalid QR", "This QR code is not valid or unreadable.");
      setIsSaving(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>We need your camera permission.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={{ color: "white" }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scannedData && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <Text style={styles.scanText}>Scan Scholar Duty QR</Text>
          </View>
        </CameraView>
      )}

      {isSaving && (
        <View style={styles.overlayCenter}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={{ color: PRIMARY_COLOR, marginTop: 10 }}>Processing...</Text>
        </View>
      )}

      {scannedData && !isSaving && (
        <>
          <QRCheckIn scannedData={scannedData} />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: PRIMARY_COLOR, marginTop: 15, marginHorizontal: 15 }]}
            onPress={() => setScannedData(null)}
          >
            <Text style={{ color: "white" }}>Scan Again</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  overlayCenter: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scanText: {
    color: "white",
    fontSize: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
