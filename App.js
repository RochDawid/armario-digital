import { StatusBar } from "expo-status-bar";
import React, { useState, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/components/Login";
import Register from "./src/components/Register";
import Main from "./src/components/Main";
import { AuthContext } from './src/context/authContext';

export default function App() {
  const Stack = createStackNavigator();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const authContext = useMemo(() => ({
    signIn: () => {
      setLoggedIn(true);
      setIsLoading(false);
    },
    signOut: () => {
      setLoggedIn(false);
      setIsLoading(false);
    },
    signUp: () => {
      setLoggedIn(true);
      setIsLoading(false);
    },
  }));

  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  return ( isLoading ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="large" /><Text style={{ marginTop: 15 }}>Un momentito guap@</Text></View> :
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName={loggedIn ? "Main" : "Login"}
            headerMode="none"
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Main" component={Main} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
