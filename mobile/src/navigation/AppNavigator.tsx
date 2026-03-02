import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TransactionListScreen from '../screens/TransactionListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUser } from '../providers/UserProvider';
import LoadingScreen from '../screens/LoadingScreen';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { user, isLoading } = useUser();

  if (isLoading) return <LoadingScreen />
  if (!user) {
    // return <LoginNavigator/> // eventually
    console.error('No user found.');
  }

  const renderOptions = (iconName: IconName) => ({
    tabBarIcon: () => <MaterialCommunityIcons name={iconName} color="black" size={21} />
  });
  console.log('Your user has an ID of ' + user.id);

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
