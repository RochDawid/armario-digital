import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import Drop from './Drop';

export default function Tab({ navigation }) {
  return (
    <View style={{ position: 'absolute', bottom: 0, alignSelf: 'flex-end', height: 100, width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <Drop bottom={true} />
      <TouchableOpacity style={{ position: 'absolute', bottom: 50 }} onPress={() => navigation.navigate('AddGarment')}>
        <Icon size={80} name="add" color="#3498db" style={{ backgroundColor: "#fff", borderRadius: 100, borderWidth: 2, borderColor: "#3498db"}}/>
      </TouchableOpacity>
    </View>
  );
}
