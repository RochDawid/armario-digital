import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";

export default function Tab({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("AddGarment")}
      >
        <Icon size={80} name="add" color="#E9EDE9" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    alignSelf: "flex-end",
    height: 100,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: { position: "absolute", bottom: 50, right: 25 },
  icon: { backgroundColor: "#1BB2EC", borderRadius: 100 },
});
