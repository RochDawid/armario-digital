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
                marginVertical: 10,
                marginHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E9EDE9",
                borderRadius: 10,
                marginBottom: 140,
                backgroundColor: "#2C3A58",
              }
            : {
                display: "flex",
                flexDirection: "row",
                flex: 1,
                marginVertical: 10,
                marginHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E9EDE9",
                borderRadius: 10,
                backgroundColor: "#2C3A58",
              }
        }
      >
        <View style={{ flex: 0.4 }}>
          <Image source={{ uri: garmentInfo.photo }} style={{ height: 150, borderTopLeftRadius: 9, borderBottomLeftRadius: 9 }} />
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
              color: "#E9EDE9",
              fontWeight: "800",
              textAlign: "center",
              marginVertical: 5,
            }}
          >
            {garmentInfo.category}
          </Text>
          <Text style={{ color: "#E9EDE9", marginVertical: 2 }}>
            Marca: {garmentInfo.brand}
          </Text>
          <Text style={{ color: "#E9EDE9" }}>Color: {garmentInfo.color}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
