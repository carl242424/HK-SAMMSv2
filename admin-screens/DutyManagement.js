import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ScholarDutyFormModal from "../components/ScholarDutyFormModal";
import ScholarDutyViewModal from "../components/ScholarDutyViewModal";
import DutyTable from "../components/DutyTable";

const PRIMARY_COLOR = "#00A4DF";

const TIMES = [
  "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
];

export default function DutyManagement() {
  const [duties, setDuties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [viewDuty, setViewDuty] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    year: "",
    course: "",
    dutyType: "",
    schedules: [{ day: "", startTime: "", endTime: "", room: "" }],
  });

  // Local time overlap logic (kept since it’s frontend only)
  const doTimeRangesOverlap = (day1, start1, end1, day2, start2, end2) => {
    if (day1 !== day2) return false;
    const startIndex1 = TIMES.indexOf(start1);
    const endIndex1 = TIMES.indexOf(end1);
    const startIndex2 = TIMES.indexOf(start2);
    const endIndex2 = TIMES.indexOf(end2);
    if (startIndex1 === -1 || endIndex1 === -1 || startIndex2 === -1 || endIndex2 === -1)
      return false;
    return startIndex1 < endIndex2 && startIndex2 < endIndex1;
  };

  const checkScheduleOverlap = (newSchedules, existingDuties, scholarId, isEditing) => {
  return newSchedules.some((newSched) => {
    if (!newSched.day || !newSched.startTime || !newSched.endTime) return false;
    return existingDuties.some((duty) => {
      // skip itself if editing
      if (
        isEditing &&
        duty.id === scholarId &&
        duty.day === newSched.day &&
        duty.time === `${newSched.startTime} - ${newSched.endTime}` &&
        duty.room === newSched.room
      )
        return false;

      const [startTime, endTime] = duty.time.split(" - ");
      return doTimeRangesOverlap(
        newSched.day,
        newSched.startTime,
        newSched.endTime,
        duty.day,
        startTime,
        endTime
      );
    });
  });
};


 // Save duty locally (no backend)
const saveDuty = async (duty, isEditing) => {
  if (!duty.id || !duty.dutyType || !duty.schedules?.length) {
    throw new Error("Scholar ID, duty type, and at least one schedule are required.");
  }

  // Skip overlap check for allowed duty types
  if (
    duty.dutyType !== "Student Facilitator" &&
    duty.dutyType !== "Attendance Checker"
  ) {
    if (checkScheduleOverlap(duty.schedules, duties, duty.id, isEditing)) {
      throw new Error(
        "The selected schedule overlaps with another. Please choose a different time slot."
      );
    }
  }

  const dutiesToSave = duty.schedules.map((s) => ({
    name: duty.name,
    id: duty.id,
    year: duty.year,
    course: duty.course,
    dutyType: duty.dutyType,
    day: s.day,
    time: `${s.startTime} - ${s.endTime}`,
    room: duty.dutyType === "Attendance Checker" ? "N/A" : s.room || "",
    status: "Active",
  }));

  if (isEditing && editIndex !== null) {
    const updatedDuties = duties.filter((d) => d.id !== duty.id);
    setDuties([...updatedDuties, ...dutiesToSave]);
  } else {
    setDuties((prevDuties) => [...prevDuties, ...dutiesToSave]);
  }

  return { success: true };
};


  // Scholar ID handler (no backend)
  const handleIdChange = (id) => {
    setFormData((prev) => ({ ...prev, id }));
    if (id.length === 14 && /^[0-9-]+$/.test(id)) {
      setFormData((prev) => ({
        ...prev,
        name: "Sample Scholar",
        year: "3rd Year",
        course: "BS INFORMATION TECHNOLOGY",
        dutyType: "Student Facilitator",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        year: "",
        course: "",
        dutyType: "",
      }));
    }
  };

  // Search filter
  const filteredDuties = duties.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Duty Management</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => {
            setModalVisible(true);
            setEditIndex(null);
            setFormData({
              id: "",
              name: "",
              year: "",
              course: "",
              dutyType: "",
              schedules: [{ day: "", startTime: "", endTime: "", room: "" }],
            });
          }}
        >
          <Text style={styles.btnText}>+ Assign Duty</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search duty..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      <Text style={styles.sectionTitle}>
        Assigned Duties ({filteredDuties.length})
      </Text>

      <DutyTable
        duties={filteredDuties}
        onEdit={(index) => {
          setEditIndex(index);
          setModalVisible(true);
          const scholarDuties = duties.filter(d => d.id === duties[index].id);
          const schedules = scholarDuties.map(d => ({
            day: d.day,
            startTime: d.time.split(" - ")[0],
            endTime: d.time.split(" - ")[1],
            room: d.room,
          }));
          setFormData({
            ...duties[index],
            schedules: schedules.length > 0 ? schedules : [{ day: "", startTime: "", endTime: "", room: "" }],
          });
        }}
        onView={(duty) => setViewDuty(duty)}
        onToggleStatus={(index) => {
          const updated = [...duties];
          updated[index].status =
            updated[index].status === "Active" ? "Deactivated" : "Active";
          setDuties(updated);
        }}
      />

      <ScholarDutyFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditIndex(null);
          setFormData({
            id: "",
            name: "",
            year: "",
            course: "",
            dutyType: "",
            schedules: [{ day: "", startTime: "", endTime: "", room: "" }],
          });
        }}
        onSave={saveDuty}
        initialData={formData}
        onIdChange={handleIdChange}
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
        TIMES={TIMES}
        ROOMS={[
          "201", "202", "CL1", "CL2", "208", "209",
          "301", "302", "304", "305", "307", "308", "309",
          "401", "402", "403", "404", "405", "CL3", "CL4",
          "408", "409",
        ]}
      />

      <ScholarDutyViewModal
        duty={viewDuty}
        onClose={() => setViewDuty(null)}
        onDeactivate={(index) => {
          const updated = [...duties];
          updated.splice(index, 1);
          setDuties(updated);
          setViewDuty(null);
        }}
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
