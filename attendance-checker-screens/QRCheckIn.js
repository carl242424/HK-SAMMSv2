import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const QRCheckIn = ({ scannedData }) => {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulate adding a new record when scannedData changes
  useEffect(() => {
    if (scannedData) {
      const newRecord = {
        studentId:
          scannedData.studentId ||
          `NO-ID-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        studentName: scannedData.studentName || "N/A",
        checkerId: "FAC001", // Example checker ID
        checkerName: "John Facilitator", // Example checker name
        checkInTime: new Date(),
        location: scannedData.location || "Room 101",
        status: "Pending",
      };

      setRecords((prev) => {
        const exists = prev.some((r) => r.studentId === newRecord.studentId);
        return exists ? prev : [newRecord, ...prev];
      });
    }
  }, [scannedData]);

  // Filter records by search
  const filteredRecords = records.filter((r) => {
    const studentName = r.studentName || "";
    const studentId = r.studentId || "";
    return (
      (typeof studentName === "string" &&
        studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof studentId === "string" &&
        studentId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 QR Check-In Records</Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search by name or ID..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {/* Table Header */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerText]}>ID</Text>
        <Text style={[styles.cell, styles.headerText]}>Name</Text>
        <Text style={[styles.cell, styles.headerText]}>Duty</Text>
        <Text style={[styles.cell, styles.headerText]}>Status</Text>
        <Text style={[styles.cell, styles.headerText]}>Time</Text>
      </View>

      {/* Table Body */}
      <ScrollView>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((r, i) => (
            <View
              key={i}
              style={[
                styles.row,
                { backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff" },
              ]}
            >
              <Text style={styles.cell}>{r.studentId}</Text>
              <Text style={styles.cell}>{r.studentName}</Text>
              <Text style={styles.cell}>{r.dutyType || "N/A"}</Text>
              <Text style={styles.cell}>{r.status}</Text>
              <Text style={styles.cell}>
                {new Date(r.checkInTime).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No check-in records yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 15,
    marginTop: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#00A4DF",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
  },
  headerRow: {
    backgroundColor: "#00A4DF",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
});

export default QRCheckIn;
