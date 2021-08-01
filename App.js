import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppNav from "./src/navigation/AppNav";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AppNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
