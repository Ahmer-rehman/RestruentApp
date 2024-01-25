import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RestaurantList from './Components/RestaurantList';
import MapScreen from "./Components/Map";
import Dishes from './Components/Dishes';
import OrderDetails from './Components/Order';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
export default function App() {
  return (  
<NavigationContainer>
  <Stack.Navigator  screenOptions={{headerShown: false,}}>
    <Stack.Screen name="List" component={RestaurantList} />
    <Stack.Screen name="Map" component={MapScreen}/>
    <Stack.Screen name="Dishes" component={Dishes} />
    <Stack.Screen name="OrderDetails" component={OrderDetails} />
  </Stack.Navigator>
</NavigationContainer> 
);
  }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
