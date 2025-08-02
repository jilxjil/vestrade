import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRef } from 'react';

// screens
import AddTradeView from './screens/AddTradeView';
import AnalyticsView from './screens/AnalyticsView';
import CalendarView from './screens/CalendarView';
import Home from './screens/Home';
import SettingsView from './screens/SettingsView';
import TradeDetailsView from './screens/TradeDetailsView';

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

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen({ navigation }: any) {
  const { theme, colorScheme } = useTheme();
  
  // Expose navigation for popToTop
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          color: theme.text,
          fontWeight: 'bold',
        },
      }}
    >
      <HomeStack.Screen name="HomeScreen" component={Home} options={{ headerShown: false }} />
      <HomeStack.Screen 
        name="TradeDetailsView" 
        component={TradeDetailsView} 
        options={{ 
          headerShown: true, 
          title: 'Trade Details',
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            color: theme.text,
            fontWeight: 'bold',
          },
        }} 
      />
    </HomeStack.Navigator>
  );
}

const NavBar = () => {
  const { theme, colorScheme } = useTheme();
  const homeStackRef = useRef<any>(null);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IoniconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            case 'AddTrade':
              iconName = focused ? 'add' : 'add-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colorScheme === 'dark' ? theme.iconColor : theme.primary,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
        tabBarLabelStyle: { paddingBottom: 6, fontSize: 10 },
        tabBarStyle: {
          paddingTop: 8,
          height: 70,
          backgroundColor: theme.background,
          borderTopWidth: 0.5,
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
        },
        screenOptions: {
          headerShown: false,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ headerShown: false }}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // Reset the Home stack to HomeScreen
            const state = navigation.getState();
            const homeTab = state.routes.find((r: any) => r.name === 'Home');
            if (homeTab && typeof homeTab.state?.index === 'number' && homeTab.state.index > 0) {
              navigation.navigate('Home');
              setTimeout(() => {
                const parentNav = navigation.getParent();
                const nestedNav = parentNav?.getState().routes.find((r: any) => r.name === 'Home');
                if (nestedNav && parentNav) {
                  parentNav.navigate('Home', { screen: 'HomeScreen' });
                }
              }, 0);
            }
          },
        })}
      />
      <Tab.Screen name="Analytics" component={AnalyticsView}
      options={{ 
        headerShown: false, 
        
      }} 
       />
      <Tab.Screen name="AddTrade" component={AddTradeView}
       options={{
        headerShown: false
      }
      }
       />
      <Tab.Screen name="Calendar" component={CalendarView}
      options={{ 
        headerShown: false, 
      
      }}  />
      <Tab.Screen name="Settings" component={SettingsView} 
       options={{ 
        headerShown: false, 
        
      }} />
    </Tab.Navigator>
  );
};

export default NavBar;
