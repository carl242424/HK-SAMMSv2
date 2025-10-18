import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const SaveAttendanceRecordTable = () => {
  // 🧾 Sample local data (for display only, not from backend)
  const [records, setRecords] = useState([
    {
      studentName: "John Doe",
      studentId: "01-2324-030012",
      yearLevel: "3rd Year",
      course: "BSIT",
      dutyType: "Library",
      room: "Room 101",
      classStatus: "Present",
      facilitatorStatus: "Checked",
      encodedTime: "2025-10-19 09:00 AM",
    },
    {
      studentName: "Jane Smith",
      studentId: "01-2324-030045",
      yearLevel: "2nd Year",
      course: "BSEd",
      dutyType: "Office",
      room: "Admin 102",
      classStatus: "Absent",
      facilitatorStatus: "Pending",
      encodedTime: "2025-10-19 09:05 AM",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = records.slice(startIndex, startIndex + recordsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>Saved Attendance Records</Text>

      {/* Table Header */}
      <View style={styles.tableRowHeader}>
        <Text style={[styles.tableCell, styles.cellHeader]}>Student Name</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Student ID</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Year</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Course</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Duty Type</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Room</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Class Status</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>
          Facilitator Status
        </Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Encoded Time</Text>
      </View>

      {/* Table Rows */}
      {currentRecords.length === 0 ? (
        <Text style={styles.noRecordsText}>No records saved yet.</Text>
      ) : (
        currentRecords.map((record, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{record.studentName}</Text>
            <Text style={styles.tableCell}>{record.studentId}</Text>
            <Text style={styles.tableCell}>{record.yearLevel}</Text>
            <Text style={styles.tableCell}>{record.course}</Text>
            <Text style={styles.tableCell}>{record.dutyType}</Text>
            <Text style={styles.tableCell}>{record.room}</Text>
            <Text style={styles.tableCell}>{record.classStatus}</Text>
            <Text style={styles.tableCell}>{record.facilitatorStatus}</Text>
            <Text style={styles.tableCell}>{record.encodedTime}</Text>
          </View>
        ))
      )}

      {/* Pagination */}
      {records.length > recordsPerPage && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
            onPress={handlePrevPage}
            disabled={currentPage === 1}
          >
            <Text style={styles.pageButtonText}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.disabledButton,
            ]}
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    marginBottom: 30,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    paddingVertical: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 6,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#333",
  },
  cellHeader: { fontWeight: "700" },
  noRecordsText: {
    textAlign: "center",
    color: "#666",
    paddingVertical: 10,
    fontStyle: "italic",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },
  pageButton: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: "#b0c4de",
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 13,
  },
  pageInfo: {
    fontSize: 13,
    color: "#333",
  },
});

export default SaveAttendanceRecordTable;
