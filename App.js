import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Home from "./src/screens/Home";
import AddGarment from "./src/screens/AddGarment";
import EditGarment from "./src/screens/EditGarment";

export default function App() {
  const Stack = createStackNavigator();

  const editGarmentOptions = {
    headerTitle: "Editar prenda",
    headerTintColor: "#E9EDE9",
    headerStyle: { backgroundColor: "#2C3A58" },
    headerBackTitle: "Armario",
  };
  const addGarmentOptions = {
    headerTitle: "Añadir prenda",
    headerTintColor: "#E9EDE9",
    headerStyle: { backgroundColor: "#2C3A58" },
    headerBackTitle: "Armario",
  };

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ gesturesEnabled: false }}
          />
          <Stack.Screen
            name="AddGarment"
            component={AddGarment}
            options={addGarmentOptions}
          />
          <Stack.Screen
            name="EditGarment"
            component={EditGarment}
            options={editGarmentOptions}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
