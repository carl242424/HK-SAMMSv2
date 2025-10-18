import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const isTabletOrLarger = width > 768;
const chartWidth = Platform.OS === "web" ? 900 : width - 64;


const useContainerWidth = () => {
  const [containerWidth, setContainerWidth] = useState(width); 

  const onLayout = useCallback((event) => {
    const newWidth = event.nativeEvent.layout.width;
    setContainerWidth(newWidth);
  }, []);

  return [containerWidth, onLayout];
};

const StatsCard = ({ title, value, detail, detailColor, iconName }) => (
  <View style={styles.card}>
    <Ionicons name={iconName} size={28} color="#60a5fa" style={styles.cardIcon} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={[styles.cardDetail, { color: detailColor }]}>
      {detail}
    </Text>
  </View>
);

const GraphPlaceholder = ({ title, height = 200, children, filterMenu = null }) => {
  const [containerWidth, onLayout] = useContainerWidth();
  const innerChartWidth = containerWidth - 32; 

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type.name) {
      if (['BarChart', 'PieChart', 'LineChart'].includes(child.type.name) || child.type.name.includes('Chart')) {
        return React.cloneElement(child, {
          width: innerChartWidth,
        });
      }
    }
    return child;
  });

  return (
    <View style={styles.graphContainer} onLayout={onLayout}>
      <Text style={styles.graphTitle}>{title}</Text>
      {filterMenu} 
      <View style={[styles.graphBox, { height: height }]}>
        {childrenWithProps}
      </View>
    </View>
  );
};

const FilterButton = ({ label, isSelected, onPress, color, bgColor }) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      {
        backgroundColor: isSelected ? (bgColor || '#1d4ed8') : '#f3f4f6', // active color vs default gray
        borderColor: isSelected ? (color || '#1d4ed8') : '#d1d5db', // active border vs gray border
      },
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.filterButtonText,
        {
          color: isSelected ? '#161616ff' : (color || '#1f2937'), // white text when active, dark when not
          fontWeight: isSelected ? 'bold' : 'normal',
        },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);



// --- NEW DATE PICKER MODAL COMPONENT ---
const DatePickerModal = ({ isVisible, onClose, onSelectDate, initialYear, initialMonthIndex }) => {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 10 }, (_, i) => currentYear + 3 - i).sort((a, b) => b - a); // 2028 down to 2019

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(initialMonthIndex);

  const handleSelect = (year, monthIndex) => {
    onSelectDate(year, MONTHS[monthIndex]);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.centeredView} onPress={onClose}>
        <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
         <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

          <Text style={styles.modalHeader}>Select Year</Text>
          <View style={styles.yearRow}>
            {YEARS.map((year) => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearButton,
                  selectedYear === year && styles.yearButtonSelected,
                ]}
                onPress={() => setSelectedYear(year)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedYear === year && styles.dateTextSelected,
                  ]}
                >
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.modalHeader}>Select Month</Text>
          <View style={styles.monthGrid}>
            {MONTHS.map((month, index) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthButton,
                  selectedMonthIndex === index && styles.monthButtonSelected,
                ]}
                onPress={() => {
                  setSelectedMonthIndex(index);
                  // Apply selection and close immediately on month click
                  handleSelect(selectedYear, index);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedMonthIndex === index && styles.dateTextSelected,
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
// --- END DATE PICKER MODAL COMPONENT ---


const Dashboard = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(width < 480);

  React.useEffect(() => {
    const handleResize = () => {
      const newWidth = Dimensions.get("window").width;
      setIsSmallScreen(newWidth < 380);
    };

    const subscription = Dimensions.addEventListener("change", handleResize);
    return () => subscription?.remove();
  }, []);
  const statsData = [
    { title: 'Total Scholar', value: '100', detail: '+5% This Month', detailColor: 'green', iconName: 'school-outline' },
    { title: 'Present Today', value: '95', detail: '80% Attendance Rate', detailColor: 'green', iconName: 'checkmark-circle-outline' },
    { title: 'Absent Today', value: '5', detail: '20% Absence Rate', detailColor: 'red', iconName: 'close-circle-outline' },
    { title: 'Weekly Average', value: '92%', detail: '+1% From last week', detailColor: 'green', iconName: 'trending-up-outline' },
    { title: 'Monthly Goal', value: '80%', detail: 'Attendance Target: 90%', detailColor: '#60a5fa', iconName: 'flag-outline' },
    { title: 'This Week', value: '500', detail: 'Total Check-ins', detailColor: 'green', iconName: 'calendar-outline' },
  ];

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`, // neutral dark text
  labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, 
  barPercentage: 0.7,
  propsForBackgroundLines: {
    stroke: '#e5e7eb',
  },
};
const statusColors = {
  present: '#10b981',
  absent: '#ef4444',
};
const now = new Date();
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const [selectedMonth, setSelectedMonth] = useState(MONTHS_FULL[now.getMonth()]);
const [selectedYear, setSelectedYear] = useState(now.getFullYear());


  // --- NEW STATE FOR MODAL ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const selectedMonthIndex = MONTHS_FULL.indexOf(selectedMonth);

  const handleDateSelect = (year, monthName) => {
    setSelectedYear(year);
    setSelectedMonth(monthName);
    setIsModalVisible(false);
  };
  // --- END NEW STATE FOR MODAL ---


  const isMonthWithHighAbsence = selectedMonth === 'Jan' || selectedMonth === 'Feb';

  // --- RAW DATA DEFINITIONS ---

  // Bar Chart Data (Daily Attendance Counts) - Modified for react-native-chart-kit format
  const getOriginalBarData = () => {
    const defaultData = [
      { day: 'Mon', present: 95, absent: 5 }, 
      { day: 'Tue', present: 92, absent: 8 }, 
      { day: 'Wed', present: 88, absent: 12}, 
      { day: 'Thu', present: 96, absent: 4}, 
      { day: 'Fri', present: 90, absent: 10}, 
    ];
    
    if (isMonthWithHighAbsence) {
      return defaultData.map(item => ({
        ...item,
        present: Math.max(0, item.present - 10),
        absent: item.absent + 10,
      }));
    }
    return defaultData;
  };
  const originalBarData = getOriginalBarData();

  const getOriginalPieData = () => {
    if (isMonthWithHighAbsence) {
      return [
        { name: 'Present', population: 380, color: 'rgba(52, 199, 89, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'present' },
        { name: 'Absent', population: 100, color: 'rgba(239, 68, 68, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'absent' },
       
      ];
    }
    return [
      { name: 'Present', population: 450, color: 'rgba(52, 199, 89, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'present' },
      { name: 'Absent', population: 50, color: 'rgba(239, 68, 68, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'absent' },
     
    ];
  };
  const originalPieData = getOriginalPieData();

  const originalLineData = {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    datasets: [
      {
        data: [85, 90, 92, 88],
        color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [10, 8, 6, 10],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [5, 2, 2, 2],
        color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Present %', 'Absent %'],
  };

  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [selectedStatusesBar, setSelectedStatusesBar] = useState(['present', 'absent']);
  const [selectedPieStatuses, setSelectedPieStatuses] = useState(['present', 'absent']); 
  const [selectedWeeks, setSelectedWeeks] = useState(['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4']);
  const [selectedStatusesLine, setSelectedStatusesLine] = useState(['present', 'absent']);

  const getFilteredData = (originalData, selectedLabels, allLabels) => {
    return allLabels.map((label, i) => selectedLabels.includes(label) ? originalData[i] : null).filter(Boolean);
  };
  
  // Helper to filter Bar Data for react-native-chart-kit (It only supports simple bars, not stacked)
 const filterBarData = () => {
  const filteredDaysData = originalBarData.filter(item =>
    selectedDays.includes(item.day)
  );

  // Single dataset combining both present & absent
  const data = [];
  const labels = [];

  filteredDaysData.forEach(item => {
    if (selectedStatusesBar.includes('present')) {
      data.push(item.present);
      labels.push(`${item.day}\nPresent`);
    }
    if (selectedStatusesBar.includes('absent')) {
      data.push(item.absent);
      labels.push(`${item.day}\nAbsent`);
    }
  });

  const colors = [];
  filteredDaysData.forEach(() => {
    if (selectedStatusesBar.includes('present')) colors.push((opacity = 1) => statusColors.present);
    if (selectedStatusesBar.includes('absent')) colors.push((opacity = 1) => statusColors.absent);
  });

  return {
    labels,
    datasets: [
      {
        data,
        colors,
      },
    ],
    legend: selectedStatusesBar.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
  };
};

  const filterPieData = () => {
    return originalPieData.filter(item => selectedPieStatuses.includes(item.status));
  };

  const filterLineData = () => {
    const filteredLabels = originalLineData.labels.filter(label => selectedWeeks.includes(label));
    if (filteredLabels.length === 0) return { labels: [], datasets: [], legend: [] };

    const statusMap = { present: 0, absent: 1 };
    const filteredDatasets = originalLineData.datasets
      .filter((_, index) => selectedStatusesLine.includes(Object.keys(statusMap)[index]))
      .map(dataset => ({
        ...dataset,
        data: getFilteredData(dataset.data, selectedWeeks, originalLineData.labels),
      }));

    const filteredLegend = originalLineData.legend.filter((_, index) => 
      selectedStatusesLine.includes(Object.keys(statusMap)[index])
    );

    return { labels: filteredLabels, datasets: filteredDatasets, legend: filteredLegend };
  };

  const barChartKitData = filterBarData();
  const filteredPieData = filterPieData();
  const filteredLineData = filterLineData();

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day].filter(Boolean)
    );
  };

  const toggleStatusBar = (status) => {
    setSelectedStatusesBar(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status].filter(Boolean)
    );
  };

  const togglePieStatus = (status) => {
    setSelectedPieStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status].filter(Boolean)
    );
  };

  const toggleWeek = (week) => {
    setSelectedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week) 
        : [...prev, week].filter(Boolean)
    );
  };

  const toggleStatusLine = (status) => {
    setSelectedStatusesLine(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status].filter(Boolean)
    );
  };

  const barFilters = (
    <View style={styles.filterMenuContainer}> 
      <View style={styles.filterRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
          <FilterButton
            key={day}
            label={day}
            isSelected={selectedDays.includes(day)}
            onPress={() => toggleDay(day)}
            color="#333333ff"
            bgColor="#f3f4f6"
          />
        ))}
      </View>
      <View style={styles.filterRow}>
        <FilterButton label="Present" isSelected={selectedStatusesBar.includes('present')} onPress={() => toggleStatusBar('present')} color="#10b981" bgColor="#d1fae5" />
        <FilterButton label="Absent" isSelected={selectedStatusesBar.includes('absent')} onPress={() => toggleStatusBar('absent')} color="#ef4444" bgColor="#fee2e2" />
        
      </View>
    </View>
  );
  
  const pieFilters = (
    <View style={styles.filterMenuContainer}> 
      <View style={styles.filterRow}>
        <FilterButton label="Present" isSelected={selectedPieStatuses.includes('present')} onPress={() => togglePieStatus('present')} color="#10b981" bgColor="#d1fae5" />
        <FilterButton label="Absent" isSelected={selectedPieStatuses.includes('absent')} onPress={() => togglePieStatus('absent')} color="#ef4444" bgColor="#fee2e2" />
        
      </View>
    </View>
  );

  const lineFilters = (
    <View style={styles.filterMenuContainer}>
      <View style={styles.filterRow}>
        {originalLineData.labels.map(week => (
          <FilterButton
            key={week}
            label={week}
            isSelected={selectedWeeks.includes(week)}
            onPress={() => toggleWeek(week)}
            color="#333"
            bgColor="#f3f4f6"
          />
        ))}
      </View>
      <View style={styles.filterRow}>
        <FilterButton label="Present" isSelected={selectedStatusesLine.includes('present')} onPress={() => toggleStatusLine('present')} color="#10b981" bgColor="#d1fae5" />
        <FilterButton label="Absent" isSelected={selectedStatusesLine.includes('absent')} onPress={() => toggleStatusLine('absent')} color="#ef4444" bgColor="#fee2e2" />
       
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionHeader}>Attendance Overview</Text>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={[
    styles.cardsRow,
    Platform.OS === "web" && { justifyContent: "flex-end", marginLeft: 240 }, // ✅ only applies on web
  ]}
>
  {statsData.map((stat, index) => (
    <StatsCard
      key={index}
      title={stat.title}
      value={stat.value}
      detail={stat.detail}
      detailColor={stat.detailColor}
      iconName={stat.iconName}
    />
  ))}
</ScrollView>


      
  <View
  style={[
    styles.sectionHeaderRow,
    isSmallScreen && { flexDirection: "column", alignItems: "flex-start" },
  ]}
>
  <Text style={styles.sectionHeader}>Attendance Trends & Distribution</Text>

  <TouchableOpacity
    style={[
      styles.datePickerButton,
      isSmallScreen && { marginTop: 8, alignSelf: "flex-start" },
    ]}
    onPress={() => setIsModalVisible(true)}
  >
    <Ionicons name="calendar-outline" size={20} color="#1d4ed8" style={{ marginRight: 8 }} />
    <Text style={styles.datePickerText}>{`${selectedMonth} ${selectedYear}`}</Text>
  </TouchableOpacity>
</View>


      <DatePickerModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectDate={handleDateSelect}
        initialYear={selectedYear}
        initialMonthIndex={selectedMonthIndex}
      />
    {/* --- END DATE PICKER BUTTON REPLACEMENT --- */}
<GraphPlaceholder
  title={`Daily Attendance Counts (${selectedMonth} ${selectedYear} | Mon-Fri)`}
  height={300}
  filterMenu={barFilters}
>
  {barChartKitData.labels.length > 0 ? (
    <>
      {/* ✅ Wrap BarChart inside a horizontal ScrollView */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={barChartKitData}
          width={Math.max(barChartKitData.labels.length * 90, width - 64)} // 👈 dynamic width
          height={260}
          fromZero
          showValuesOnTopOfBars
          flatColor
          showBarTops={false}
          withCustomBarColorFromData
          chartConfig={{
            ...chartConfig,
            barPercentage: 0.5,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
            propsForLabels: { fontSize: 12, fontWeight: '600' },
            propsForBackgroundLines: { stroke: '#d1d5db', strokeDasharray: '4' },
          }}
          style={{
            marginVertical: 10,
            borderRadius: 12,
            paddingRight: 30, // prevents last bar cutoff
          }}
          renderCustomBarContent={({ x, y, width, height, index, value }) => (
            <View key={index}>
              {/* 🔢 Value label above bar */}
              <Text
                style={{
                  position: 'absolute',
                  left: x + width / 2 - 15,
                  top: y - 18,
                  fontSize: 12,
                  fontWeight: '700',
                  color: '#111827',
                  textAlign: 'center',
                  width: 30,
                }}
              >
                {value}
              </Text>

              {/* 🎨 Rounded bar overlay */}
              <View
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: width,
                  height: height,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  overflow: 'hidden',
                }}
              />
            </View>
          )}
        />
      </ScrollView>

      {/* 🧭 Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: statusColors.present },
            ]}
          />
          <Text style={styles.legendText}>Present</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: statusColors.absent },
            ]}
          />
          <Text style={styles.legendText}>Absent</Text>
        </View>
      </View>
    </>
  ) : (
    <Text style={styles.graphLabel}>
      No data selected. Please choose at least one day and one status.
    </Text>
  )}
</GraphPlaceholder>

      
      <View style={styles.splitGraphsContainer}>
   <View
    style={{
      flex: 1,
      ...(Platform.OS === "web" && { maxWidth: "36%", height: 480 }), // 👈 taller container on web
    }}
  >
    <GraphPlaceholder
      title={`Monthly Distribution (${selectedMonth} ${selectedYear})`}
      height={Platform.OS === "web" ? 430 : 250} // 👈 taller chart box on web only
      filterMenu={pieFilters}
    >
      {filteredPieData.length > 0 ? (
        <PieChart
          data={filteredPieData}
          height={Platform.OS === "web" ? 390 : 200} // 👈 bigger pie chart on web only
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          center={[isTabletOrLarger ? 50 : 0, 0]}
        />
      ) : (
        <Text style={styles.graphLabel}>No data selected.</Text>
      )}
    </GraphPlaceholder>
  </View>

  <View
  style={{
    flex: 1,
    ...(Platform.OS === "web" && { maxWidth: "69%", height: 480 }), // 👈 taller container on web
  }}
>
  <GraphPlaceholder
    title={`Weekly Attendance Rate (${selectedMonth} ${selectedYear})`}
    height={Platform.OS === "web" ? 390 : 280} // 👈 larger height on web
    filterMenu={lineFilters}
  >
    {filteredLineData.labels.length > 0 ? (
      <LineChart
        data={filteredLineData}
        height={Platform.OS === "web" ? 320 : 220} // 👈 chart itself taller on web
        width={chartWidth}
        chartConfig={chartConfig}
        bezier
        withVerticalLines={false}
        withDots={true}
        showLegend={true}
        withShadow={true}
      />
    ) : (
      <Text style={styles.graphLabel}>No data selected.</Text>
    )}
  </GraphPlaceholder>
</View>

</View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fa',
  },
  contentContainer: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
cardsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
  paddingVertical: 16,
},


  card: {
  width: 180, // wider for more spacing
  minHeight: 130,
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 20,
  marginHorizontal: 10, // spacing between cards
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 5,
},

  cardIcon: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  cardDetail: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  monthPickerContainer: {
    marginBottom: 20,
    // Note: The previous monthPickerContainer styling is mostly moved to datePickerButton
  },
 datePickerButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderWidth: 1,
  borderColor: '#e5e7eb',

  // 🌙 Shadow (iOS & Android)
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,

  // 💻 Web shadow fallback
  ...(Platform.OS === 'web' && {
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)',
    transition: 'box-shadow 0.2s ease-in-out',
  }),
},

  datePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
graphContainer: {
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 16,
  marginBottom: 24,
  // 💡 Add border for outline
  borderWidth: 1,
  borderColor: '#e5e7eb',

  // 💡 Add strong drop shadow (for both iOS & Android)
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 6,

  // 💡 Add subtle outer glow effect (works nicely on web too)
  ...(Platform.OS === 'web' && {
    boxShadow:
      '0px 4px 10px rgba(0,0,0,0.15), 0px 0px 4px rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.2s ease-in-out',
  }),
},

  graphTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
graphBox: {
  backgroundColor: '#f9fafb', // softer than #eef2ff
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  paddingVertical: 8,
  paddingHorizontal: 8,
  overflow: 'hidden',
},

  graphLabel: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    padding: 20,
  },
  legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: -5,
      marginBottom: 10,
      gap: 20,
  },
  legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  legendColor: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 6,
  },
  legendText: {
      fontSize: 12,
      color: '#333',
  },
splitGraphsContainer: {
  flexDirection: Platform.OS === "web" ? "row" : "column", // ✅ side by side on web
  justifyContent: "space-between",
  gap: 20, // add spacing between graphs on web
},

  filterMenuContainer: { 
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // --- MODAL STYLES ---
  centeredView: {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalView: {
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 20,
  alignItems: 'flex-start',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  width: Math.min(width * 0.9, 400),
  position: 'absolute',

  // ✅ Automatically move modal below the header on mobile
  top: width < 480 ? 160 : 80, // 160px on mobile, 80px on larger screens
},

  modalHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  yearRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  yearButton: {
    width: '20%', // 5 columns
    aspectRatio: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  yearButtonSelected: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  monthButton: {
    width: '33.333%', // 3 columns
    aspectRatio: 2, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  monthButtonSelected: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  dateTextSelected: {
    color: 'white',
    fontWeight: '700',
  },
  closeButton: {
  position: 'absolute',
  top: 10,
  right: 12,
  zIndex: 10,
  borderRadius: 20,
  width: 28,
  height: 28,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 2, // adds shadow on Android
},
closeButtonText: {
  fontSize: 20,
  fontWeight: 'bold',
  lineHeight: 20,
},
sectionHeaderRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 20,
  marginBottom: 10,
},
chartShadowWrapper: {
  backgroundColor: 'white',
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 6, // Android shadow
  padding: 8, // optional for spacing around chart
  marginVertical: 6,
},

});

export default Dashboard;