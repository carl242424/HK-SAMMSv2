import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import ScholarDutyFormModal from "../components/QRDutyFormModal";
import ScholarDutyQR from "../components/QRDutyQR";

const PRIMARY_COLOR = "#00A4DF";

export default function GenerateQR() {
  const [qrDuties, setQrDuties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const saveQrDuty = (duty) => {
    const recordId = duty.recordId || Date.now().toString();
    const newDuty = {
      ...duty,
      recordId,
      id: duty.id || recordId,
    };
    console.log("Saving new duty:", JSON.stringify(newDuty, null, 2));
    setQrDuties((prev) => [...prev, newDuty]);
    setModalVisible(false);
  };

  const removeQrDuty = (recordId) => {
    console.log("Removing duty with recordId:", recordId);
    setQrDuties((prev) => prev.filter((duty) => duty.recordId !== recordId));
  };

  const filteredQr = qrDuties.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Generator</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnText}>+ Create Duty QR</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search by student name or ID..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          Duty Schedule QR Codes ({filteredQr.length})
        </Text>

        {filteredQr.length > 0 ? (
          filteredQr.map((duty, i) => (
            <ScholarDutyQR
              key={duty.recordId || `fallback-${i}`}
              duty={duty}
              onRemove={removeQrDuty}
            />
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
            No QR duties created yet.
          </Text>
        )}
      </ScrollView>

      <ScholarDutyFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={saveQrDuty}
        fetchedDuties={[]} // no backend data
        YEARS={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
        COURSES={[
          "BS ACCOUNTANCY",
          "BS HOSPITALITY MANAGEMENT",
          "BS TOURISM MANAGEMENT",
          "BSBA- MARKETING MANAGEMENT",
          "BSBA- BANKING & MICROFINANCE",
          "BACHELOR OF ELEMENTARY EDUCATION",
          "BSED- ENGLISH",
          "BSED- FILIPINO",
          "BS CRIMINOLOGY",
          "BS CIVIL ENGINEERING",
          "BS INFORMATION TECHNOLOGY",
          "BS NURSING",
        ]}
        DUTY_TYPES={["Student Facilitator", "Attendance Checker"]}
        DAYS={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
        TIMES={[
          "7:00 AM",
          "7:30 AM",
          "8:00 AM",
          "8:30 AM",
          "9:00 AM",
          "9:30 AM",
          "10:00 AM",
          "10:30 AM",
          "11:00 AM",
          "11:30 AM",
          "12:00 PM",
          "12:30 PM",
          "1:00 PM",
          "1:30 PM",
          "2:00 PM",
          "2:30 PM",
          "3:00 PM",
          "3:30 PM",
          "4:00 PM",
          "4:30 PM",
          "5:00 PM",
          "5:30 PM",
          "6:00 PM",
        ]}
        ROOMS={[
          "201",
          "202",
          "CL1",
          "CL2",
          "208",
          "209",
          "301",
          "302",
          "304",
          "305",
          "307",
          "308",
          "309",
          "401",
          "402",
          "403",
          "404",
          "405",
          "CL3",
          "CL4",
          "408",
          "409",
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "bold", marginTop: 30 },
  createBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 30,
  },
  btnText: { color: "white", fontWeight: "600" },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
});
