import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function Garment({ garmentInfo, navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("EditGarment")}>
      <View
        style={
          garmentInfo.last
            ? {
                display: "flex",
                flexDirection: "row",
                flex: 1,
                padding: 10,
                marginVertical: 10,
                marginHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#3498db",
                borderRadius: 25,
                marginBottom: 140,
              }
            : {
                display: "flex",
                flexDirection: "row",
                flex: 1,
                padding: 10,
                marginVertical: 10,
                marginHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#3498db",
                borderRadius: 25,
              }
        }
      >
        <View style={{ flex: 0.4 }}>
          <Image source={{ uri: garmentInfo.photo }} style={{ height: 150 }} />
        </View>
        <View
          style={{
            flex: 0.6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#3498db",
              fontWeight: "800",
              textAlign: "center",
              marginVertical: 5,
            }}
          >
            {garmentInfo.category}
          </Text>
          <Text style={{ color: "#3498db", marginVertical: 2 }}>
            Marca: {garmentInfo.brand}
          </Text>
          <Text style={{ color: "#3498db" }}>Color: {garmentInfo.color}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
