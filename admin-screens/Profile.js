import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const PRIMARY_COLOR = "#00A4DF";

export default function Profile() {
  const adminData = {
    name: "John Doe",
    id: "EMP001",
    status: "Active",
    password: "********",
  };

  const handleLogout = () => {
    console.log("Logged out");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Profile</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{adminData.name}</Text>

        <Text style={styles.label}>Employee ID:</Text>
        <Text style={styles.value}>{adminData.id}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            adminData.status === "Active" ? styles.active : styles.inactive,
          ]}
        >
          {adminData.status}
        </Text>

        <Text style={styles.label}>Password:</Text>
        <Text style={styles.value}>{adminData.password}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  profileCard: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  label: { fontSize: 14, color: "#555", marginTop: 10 },
  value: { fontSize: 16, fontWeight: "600", color: "#333" },

  active: { color: "green" },
  inactive: { color: "red" },

  logoutBtn: {
  backgroundColor: "#e0e0e0",
  paddingVertical: 4,  // reduced from 8
  paddingHorizontal: 12, // reduced from 20
  borderRadius: 16,      // slightly smaller radius
  alignSelf: "center",
},
logoutText: {
  color: "#333",
  fontWeight: "600",
  fontSize: 12, // reduced from 14
},

});
