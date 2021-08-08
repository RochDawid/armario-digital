import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";

export default function Garment({ garmentInfo, navigation, last }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("EditGarment", garmentInfo)}
    >
      <View
        style={last ? styles.garmentContainerLast : styles.garmentContainer}
      >
        <View style={{ flex: 0.4 }}>
          <Image source={{ uri: garmentInfo.photo }} style={styles.image} />
        </View>
        <View style={styles.container}>
          {garmentInfo.washing && (
            <View style={styles.washingContainer}>
              <Icon
                name="washing-machine"
                color="#1BB2EC"
                type="material-community"
                size={40}
              />
            </View>
          )}
          <Text style={styles.categoryText}>{garmentInfo.category}</Text>
          <Text style={styles.brandText}>Marca: {garmentInfo.brand}</Text>
          <Text style={styles.colorText}>Color: {garmentInfo.color}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  garmentContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1BB2EC",
    borderRadius: 10,
    backgroundColor: "#2C3A58",
  },
  garmentContainerLast: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1BB2EC",
    borderRadius: 10,
    marginBottom: 140,
    backgroundColor: "#2C3A58",
  },
  image: {
    height: 150,
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  container: {
    flex: 0.6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  washingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 10,
    left: 80,
  },
  categoryText: {
    color: "#E9EDE9",
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 5,
    textAlign: "center",
  },
  brandText: { color: "#E9EDE9", textAlign: "center", marginVertical: 2 },
  colorText: { color: "#E9EDE9", textAlign: "center", marginVertical: 2 },
});
