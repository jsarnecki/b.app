import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import TransactionListScreen from "../screens/TransactionListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const Tab = createBottomTabNavigator();

export default function AppNavigator() {

  const renderOptions = (iconName: IconName) => ({
    tabBarIcon: () => <MaterialCommunityIcons name={iconName} color="black" size={21} />
  });

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={renderOptions('cog')}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={renderOptions('home')}
        />
        <Tab.Screen
          name="List"
          component={TransactionListScreen}
          options={renderOptions('format-list-bulleted-triangle')}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
