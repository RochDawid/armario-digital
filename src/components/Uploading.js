import React from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

export default function Uploading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#1BB2EC" animating size="large" />
      <Text style={{ color: "#E9EDE9", paddingTop: 5, fontWeight: "600" }}>
        Dándole un vuelco a tu armario...🕗
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202832",
    paddingBottom: "40%",
  },
});
