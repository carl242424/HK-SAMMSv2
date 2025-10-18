import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function AttendancePhoto() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [records, setRecords] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      if (!permission) await requestPermission();
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        const geo = await Location.reverseGeocodeAsync(loc.coords);
        if (geo.length > 0) {
          setAddress(
            `${geo[0].name || ""} ${geo[0].street || ""}, ${geo[0].city || ""}, ${
              geo[0].region || ""
            }`
          );
        }
      } catch (err) {
        console.warn("Location fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!permission) return <View style={styles.center} />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const capturePhoto = async () => {
    try {
      if (!cameraRef.current) {
        console.warn("Camera not ready yet (ref null)");
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (!photo || !photo.uri) return;

      const currentTimestamp = new Date().toLocaleString();
      const newRecord = {
        id: Date.now().toString(),
        uri: photo.uri,
        time: currentTimestamp,
        latitude: location ? location.latitude.toFixed(4) : "N/A",
        longitude: location ? location.longitude.toFixed(4) : "N/A",
        address: address || "N/A",
        studentId: "12345",
        status: "Present", // ✅ added
        remarks: "On time", // ✅ added
      };

      setRecords((prev) => [newRecord, ...prev]);
      setIsCameraOpen(false);
    } catch (err) {
      console.error("capturePhoto error:", err);
    }
  };

  const filteredRecords = records.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return item.time.toLowerCase().includes(q) || item.address.toLowerCase().includes(q);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Attendance Photo</Text>

      <TouchableOpacity style={styles.button} onPress={() => setIsCameraOpen(true)}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by date, time, or address..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Camera Modal */}
      <Modal visible={isCameraOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

          <View style={styles.controls}>
            <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto}>
              <Text style={styles.captureText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipBtn} onPress={toggleCameraFacing}>
              <Text style={styles.flipText}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flipBtn, { backgroundColor: "#E53935" }]}
              onPress={() => setIsCameraOpen(false)}
            >
              <Text style={styles.flipText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Viewer */}
      <Modal visible={isImageViewOpen} transparent animationType="fade">
        <View style={styles.imageViewContainer}>
          <TouchableOpacity style={styles.closeImageBtn} onPress={() => setIsImageViewOpen(false)}>
            <Text style={{ color: "#fff", fontSize: 18 }}>✕</Text>
          </TouchableOpacity>

          {selectedImageUri && (
            <View style={styles.fullImageWrapper}>
              <Image source={{ uri: selectedImageUri }} style={styles.fullImage} resizeMode="contain" />
              <View style={styles.overlayBox}>
                <Text style={styles.overlayText}>
                  {`Time: ${getRecordField(selectedImageUri, records, "time") || ""}`}
                </Text>
                <Text style={styles.overlayText}>
                  {`Address: ${getRecordField(selectedImageUri, records, "address") || ""}`}
                </Text>
                <Text style={styles.overlayText}>
                  {`Lat: ${getRecordField(selectedImageUri, records, "latitude") || ""}  Lng: ${getRecordField(
                    selectedImageUri,
                    records,
                    "longitude"
                  ) || ""}`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* ✅ Enhanced Table Layout */}
      <View style={styles.tableWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            {/* Header */}
            <View style={styles.tableHeader}>
              <View style={[styles.columnHeader, { width: 90 }]}>
                <Text style={styles.headerText}>Photo</Text>
              </View>
              <View style={[styles.columnHeader, { width: 160 }]}>
                <Text style={styles.headerText}>Time</Text>
              </View>
              <View style={[styles.columnHeader, { width: 120 }]}>
                <Text style={styles.headerText}>Latitude</Text>
              </View>
              <View style={[styles.columnHeader, { width: 120 }]}>
                <Text style={styles.headerText}>Longitude</Text>
              </View>
              <View style={[styles.columnHeader, { width: 240 }]}>
                <Text style={styles.headerText}>Address</Text>
              </View>
              <View style={[styles.columnHeader, { width: 120 }]}>
                <Text style={styles.headerText}>Student ID</Text>
              </View>
              <View style={[styles.columnHeader, { width: 120 }]}>
                <Text style={styles.headerText}>Status</Text>
              </View>
              <View style={[styles.columnHeader, { width: 180 }]}>
                <Text style={styles.headerText}>Remarks</Text>
              </View>
            </View>

            {/* Rows */}
            <ScrollView style={{ maxHeight: SCREEN_H * 0.45 }}>
              {filteredRecords.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>No matching records.</Text>
              ) : (
                filteredRecords.map((item) => (
                  <View style={styles.tableRow} key={item.id}>
                    {/* Photo */}
                    <View style={[styles.columnCell, { width: 90, alignItems: "center" }]}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedImageUri(item.uri);
                          setIsImageViewOpen(true);
                        }}
                      >
                        <Image source={{ uri: item.uri }} style={styles.tableImage} />
                      </TouchableOpacity>
                    </View>

                    <View style={[styles.columnCell, { width: 160 }]}>
                      <Text style={styles.cellText}>{item.time}</Text>
                    </View>

                    <View style={[styles.columnCell, { width: 120 }]}>
                      <Text style={styles.cellText}>{item.latitude}</Text>
                    </View>

                    <View style={[styles.columnCell, { width: 120 }]}>
                      <Text style={styles.cellText}>{item.longitude}</Text>
                    </View>

                    <View style={[styles.columnCell, { width: 240 }]}>
                      <Text style={styles.cellText}>{item.address}</Text>
                    </View>

                    <View style={[styles.columnCell, { width: 120 }]}>
                      <Text style={styles.cellText}>{item.studentId}</Text>
                    </View>

                    <View style={[styles.columnCell, { width: 120 }]}>
                      <Text style={styles.cellText}>{item.status}</Text>
                    </View>

                    <View style={[styles.columnCell, { width: 180 }]}>
                      <Text style={styles.cellText}>{item.remarks}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// Helper
function getRecordField(uri, records, field) {
  const r = records.find((x) => x.uri === uri);
  return r ? r[field] : "";
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb", paddingHorizontal: 10, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 15 },
  button: {
    marginTop: 10,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 18 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 15,
  },
  modalContainer: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  captureBtn: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 8 },
  captureText: { color: "white", fontSize: 18 },
  flipBtn: { backgroundColor: "#007BFF", padding: 14, borderRadius: 8 },
  flipText: { color: "white", fontSize: 18 },

  /** ✅ Table Styling */
  tableWrapper: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  columnHeader: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  columnCell: {
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
    flexWrap: "wrap",
  },
  cellText: {
    fontSize: 13,
    textAlign: "center",
    flexShrink: 1,
    flexWrap: "wrap",
    lineHeight: 16,
  },
  tableImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginVertical: 5,
  },

  imageViewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImageWrapper: {
    width: SCREEN_W * 0.95,
    height: SCREEN_H * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: "100%", height: "100%", borderRadius: 10 },
  overlayBox: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 6,
    maxWidth: SCREEN_W * 0.7,
  },
  overlayText: { color: "#fff", fontSize: 13, lineHeight: 18 },
  closeImageBtn: { position: "absolute", top: 40, right: 20, zIndex: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
});
