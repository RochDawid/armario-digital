import React from "react";
import { StyleSheet, View } from "react-native";

export default function Drop({ bottom }) {
  return <View style={bottom ? styles.drop2 : styles.drop} />;
}

const styles = StyleSheet.create({
  drop: {
    backgroundColor: "#1BB2EC",
    position: "absolute",
    height: 2000,
    width: 2000,
    borderRadius: 500,
    top: -1625,
    left: -1550,
  },
  drop2: {
    backgroundColor: "#1BB2EC",
    position: "absolute",
    height: 600,
    width: 550,
    borderRadius: 200,
    top: 0,
  },
});
