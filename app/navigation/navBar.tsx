import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Remove this import: import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

//screens
import AddTradeView from './screens/AddTradeView';
import AnalyticsView from './screens/AnalyticsView';
import CalendarView from './screens/CalendarView';
import Home from './screens/Home';
import SettingsView from './screens/SettingsView';


type IoniconName =
  | 'home'
  | 'home-outline'
  | 'add'
  | 'add-outline'
  | 'analytics'
  | 'analytics-outline'
  | 'calendar'
  | 'calendar-outline'
  | 'settings'
  | 'settings-outline';

let iconName: IoniconName;



const HomeScreen = 'Home';
const AddTradeScreen = 'AddTrade';
const AnalyticsScreen = 'Analytics';
const CalendarScreen = 'Calendar';
const SettingsScreen = 'Settings';

const Tab = createBottomTabNavigator();

const navBar = () => {

  const {theme} = useTheme();
  return (
    // Remove the NavigationContainer wrapper
    <Tab.Navigator
      initialRouteName={HomeScreen}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
        let iconName: IoniconName;

        switch (route.name) {
          case HomeScreen:
            iconName = focused ? 'home' : 'home-outline';
            break;
          case AnalyticsScreen:
            iconName = focused ? 'analytics' : 'analytics-outline';
            break;
          case AddTradeScreen:
            iconName = focused ? 'add' : 'add-outline';
            break;  
          case CalendarScreen:
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case SettingsScreen:
            iconName = focused ? 'settings' : 'settings-outline';
            break;
          default:
            iconName = 'home-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: 'grey',
      tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
      tabBarStyle: { padding: 10, height: 70 },
    })}
    >
        <Tab.Screen name={HomeScreen} component={Home}/>
        <Tab.Screen name={AnalyticsScreen} component={AnalyticsView}/>
        <Tab.Screen name={AddTradeScreen} component={AddTradeView}/>
        <Tab.Screen name={CalendarScreen} component={CalendarView}/>
        <Tab.Screen name={SettingsScreen} component={SettingsView}/>
    </Tab.Navigator>
    // Remove the closing NavigationContainer tag
  )
}

export default navBar;