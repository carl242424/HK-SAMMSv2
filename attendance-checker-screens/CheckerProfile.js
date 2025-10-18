import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CheckerProfile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance Checker Profile</Text>

      <View style={styles.infoBox}>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>John Doe</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Student ID:</Text>
          <Text style={styles.value}>2025-001</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Year:</Text>
          <Text style={styles.value}>3rd Year</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Course:</Text>
          <Text style={styles.value}>BS Information Technology</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duty Type:</Text>
          <Text style={styles.value}>Attendance Checker</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400, // ✅ keeps it compact on wide screens
    borderRadius: 10,
    padding: 16,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },
  logoutButton: {
    alignSelf: "flex-end",
    backgroundColor: "#ffe6e6",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginTop: 15,
    transition: "background-color 0.2s ease",
  },
  logoutText: {
    color: "#a60000",
    fontWeight: "600",
    fontSize: 13,
  },
});

export default CheckerProfile;
