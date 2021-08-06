import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";

export default function AddGarment() {
  return (
    <View>
      <TouchableOpacity>
        <Icon name="camera" size={120} color="white" style={{ backgroundColor: "gray", width: 150, borderRadius: 20 }} />
      </TouchableOpacity>
      <Text>Tipo de prenda</Text>
      <TextInput />
      <Text>Marca</Text>
      <TextInput />
      <Text>Color</Text>
      <TextInput />
    </View>
  );
}
