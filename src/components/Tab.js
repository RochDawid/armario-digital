import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";

export default function Tab({ navigation }) {
  return (
    <View style={{ position: 'absolute', bottom: 0, alignSelf: 'flex-end', height: 100, width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity style={{ position: 'absolute', bottom: 50, right: 25 }} onPress={() => navigation.navigate('AddGarment')}>
        <Icon size={80} name="add" color="#1BB2EC" style={{ backgroundColor: "#E9EDE9", borderRadius: 100, borderWidth: 2, borderColor: "#1BB2EC"}}/>
      </TouchableOpacity>
    </View>
  );
}
