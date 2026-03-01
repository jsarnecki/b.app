import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import TransactionListScreen from "../screens/TransactionListScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="List" component={TransactionListScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
