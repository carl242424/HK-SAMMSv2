import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";

const DutyTable = ({ duties = [], onEdit, onView, onToggleStatus }) => {
  const { width: screenWidth } = useWindowDimensions();

  const columnWidth = 140;
  const actionWidth = 200;
  const totalColumns = 7; // Name, Duty, Day, Time, Room, Status
  const tableMinWidth = totalColumns * columnWidth + actionWidth;

  return (
    <ScrollView
      horizontal={screenWidth < tableMinWidth}
      style={{ width: "100%" }}
      contentContainerStyle={{
        minWidth: screenWidth < tableMinWidth ? tableMinWidth : "100%",
        paddingRight: 16,
      }}
    >
      <View style={[styles.tableContainer, { width: "100%" }]}>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.header]}>Student Name</Text>
          <Text style={[styles.cell, styles.header]}>Duty Type</Text>
          <Text style={[styles.cell, styles.header]}>Day</Text>
          <Text style={[styles.cell, styles.header]}>Time</Text>
          <Text style={[styles.cell, styles.header]}>Room</Text>
          <Text style={[styles.cell, styles.header]}>Hours</Text>
          <Text style={[styles.cell, styles.header]}>Status</Text>
          <Text style={[styles.actionsCellHeader, styles.header]}>Actions</Text>
        </View>

        {duties.length > 0 ? (
          duties.map((duty, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{duty.name || "N/A"}</Text>
              <Text style={styles.cell}>{duty.dutyType || "N/A"}</Text>
              <Text style={styles.cell}>{duty.day || "N/A"}</Text>
              <Text style={styles.cell}>{duty.time || "N/A"}</Text>
              <Text style={styles.cell}>
                {duty.room || (duty.dutyType === "Attendance Checker" ? "—" : "N/A")}
              </Text>
              <Text style={styles.cell}>
  {(duty.dutyType === "Student Facilitator" || duty.dutyType === "Attendance Checker") 
    ? "70 hrs (Total)" 
    : "N/A"}
</Text>

              <Text
                style={[
                  styles.cell,
                  { color: duty.status === "Deactivated" ? "#d9534f" : "green" },
                ]}
              >
                {duty.status || "Active"}
              </Text>

              {/* Actions */}
              <View style={styles.actionsCell}>
              
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => onEdit && onEdit(index)}
                >
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>

              
              </View>
            </View>
          ))
        ) : (
          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 1 }]}>No duties found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
  headerRow: {
    backgroundColor: "#f4f4f4",
  },
  cell: {
    flex: 1,
    minWidth: 140,
    paddingHorizontal: 6,
  },
  actionsCellHeader: {
    width: 200,
    paddingHorizontal: 6,
  },
  actionsCell: {
    width: 200,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  header: {
    fontWeight: "bold",
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  viewBtn: {
    backgroundColor: "#0078d7",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  editBtn: {
    backgroundColor: "#f0ad4e",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default DutyTable;