// 🏠 App.js (Frontend only — backend removed)

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigators (Frontend navigation only)
import AdminNavigator from './navigations/AdminNavigator';
import CheckerNavigator from './navigations/CheckerNavigator';
import StudentFaciNavigator from './navigations/StudentFaciNavigator';

// Screens
import LoginScreen from './screen/LoginScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Starting screen */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Role-based navigators */}
        <Stack.Screen name="AdminTabs" component={AdminNavigator} />
        <Stack.Screen name="AttendanceCheckerTabs" component={CheckerNavigator} />
        <Stack.Screen name="StudentFacilitatorTabs" component={StudentFaciNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
