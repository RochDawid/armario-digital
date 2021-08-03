import { StatusBar } from "expo-status-bar";
import React, { useState, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/components/Login";
import Register from "./src/components/Register";
import Main from "./src/components/Main";
import { AuthContext } from "./src/context/authContext";
import Auth0 from "react-native-auth0";

var credentials = require("./authConfig");
const auth0 = new Auth0(credentials);

export default function App() {
  const Stack = createStackNavigator();
  const [accessToken, setAccessToken] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  _onLogin = () => {
    auth0.webAuth
      .authorize({
        scope: "openid profile email",
      })
      .then((credentials) => {
        Alert.alert("AccessToken: " + credentials.accessToken);
        setAccessToken(credentials.accessToken);
      })
      .catch((error) => console.log(error));
  };

  _onLogout = () => {
    auth0.webAuth
      .clearSession({})
      .then((success) => {
        Alert.alert("Logged out!");
        setAccessToken(null);
      })
      .catch((error) => {
        console.log("Log out cancelled");
      });
  };

  const authContext = useMemo(() => ({
    signIn: () => {
      _onLogin();
      setLoggedIn(true);
      setIsLoading(false);
    },
    signOut: () => {
      _onLogout();
      setLoggedIn(false);
      setIsLoading(false);
    },
    signUp: () => {
      _onLogin();
      setLoggedIn(true);
      setIsLoading(false);
    },
  }));

  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  return isLoading ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 15 }}>Un momentito guap@</Text>
    </View>
  ) : (
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
