import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AdminProfile() {
  const [adminData] = useState({
    name: "Test Admin",
    id: "000-000-000",
    status: "Active",
    password: "********",
  });

  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{adminData.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Employee ID:</Text>
          <Text style={styles.value}>{adminData.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.value,
              adminData.status === "Active" ? styles.active : styles.inactive,
            ]}
          >
            {adminData.status}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Password:</Text>
          <Text style={styles.value}>{adminData.password}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  profileCard: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 380, // ✅ keeps layout compact on web
    padding: 16,
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // ✅ subtle web shadow
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
    fontWeight: "600",
    color: "#222",
  },
  active: { color: "green" },
  inactive: { color: "red" },
  logoutBtn: {
    backgroundColor: "#ffe6e6",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginTop: 15,
    transition: "background-color 0.2s ease", // ✅ smooth hover
  },
  logoutText: {
    color: "#a60000",
    fontWeight: "600",
    fontSize: 13,
  },
});
