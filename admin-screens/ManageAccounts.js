import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import ScholarFormModal from "../components/ScholarFormModal";
import ScholarViewModal from "../components/ScholarViewModal";
import ScholarTable from "../components/ScholarTable";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const PRIMARY_COLOR = "#00A4DF";
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const COURSES = [
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
];
const DUTY_TYPES = ["Student Facilitator", "Attendance Checker"];

export default function ManageAccounts() {
  const [scholars, setScholars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    id: "",
    year: YEARS[0],
    course: COURSES[0],
    duty: DUTY_TYPES[0],
    status: "Active",
    remainingHours: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [viewScholar, setViewScholar] = useState(null);

  const updateForm = (field, value) =>
    setForm((prevForm) => ({ ...prevForm, [field]: value }));

  const saveScholar = (data, isEditing) => {
    try {
      if (isEditing && editIndex !== null) {
        const updated = [...scholars];
        updated[editIndex] = data;
        setScholars(updated);
      } else {
        const newScholar = { ...data, status: "Active", remainingHours: 0 };
        setScholars((prev) => [...prev, newScholar]);
      }
      resetForm();
    } catch (err) {
      Alert.alert("Error", "Failed to save scholar");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      id: "",
      year: YEARS[0],
      course: COURSES[0],
      duty: DUTY_TYPES[0],
      status: "Active",
      remainingHours: 0,
    });
    setEditIndex(null);
    setModalVisible(false);
  };

  const toggleScholarStatus = (scholar) => {
    const updated = scholars.map((s) =>
      s.id === scholar.id
        ? {
            ...s,
            status: s.status === "Active" ? "Inactive" : "Active",
          }
        : s
    );
    setScholars(updated);
    Alert.alert(
      "Status Updated",
      `Scholar ${scholar.name}'s status changed successfully.`
    );
  };

  const filteredScholars = scholars.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🧾 Export to PDF
  const exportToPDF = async (filteredScholars) => {
    const escapeHtml = (text) =>
      String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Scholar Accounts Report</title>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; margin: 20px; font-size: 12px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f0f0f0; }
            tbody tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Scholar Accounts Report</h1>
          <p style="text-align:center;">Generated: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr><th>Name</th><th>ID</th><th>Year</th><th>Course</th><th>Duty</th><th>Hours Left</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${
                filteredScholars.length > 0
                  ? filteredScholars
                      .map(
                        (s) =>
                          `<tr>
                            <td>${escapeHtml(s.name)}</td>
                            <td>${escapeHtml(s.id)}</td>
                            <td>${escapeHtml(s.year)}</td>
                            <td>${escapeHtml(s.course)}</td>
                            <td>${escapeHtml(s.duty)}</td>
                            <td>${s.remainingHours ?? 0}</td>
                            <td>${s.status}</td>
                          </tr>`
                      )
                      .join("")
                  : `<tr><td colspan="7" style="text-align:center;">No scholars found</td></tr>`
              }
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "application/pdf" });
      } else {
        Alert.alert("PDF Generated", `Saved at: ${uri}`);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Accounts</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnText}>+ Create Scholar Account</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search scholar..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      <ScrollView>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Scholar Accounts ({filteredScholars.length})
          </Text>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => exportToPDF(filteredScholars)}
          >
            <Text style={styles.exportBtnText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

        <ScholarTable
          scholars={filteredScholars}
          onView={(scholar) => setViewScholar(scholar)}
          onEdit={(index) => {
            setEditIndex(index);
            setForm(filteredScholars[index]);
            setModalVisible(true);
          }}
          onToggleStatus={toggleScholarStatus}
        />
      </ScrollView>

      <ScholarFormModal
        visible={modalVisible}
        onClose={resetForm}
        onSave={saveScholar}
        initialData={editIndex !== null ? form : null}
        YEARS={YEARS}
        COURSES={COURSES}
        DUTY_TYPES={DUTY_TYPES}
      />

      <ScholarViewModal
        scholar={viewScholar}
        onClose={() => setViewScholar(null)}
        onDeactivate={(scholar) => toggleScholarStatus(scholar)}
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  exportBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  exportBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
