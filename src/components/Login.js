import React, { useContext, useState } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from "react-native";
import Drop from "./Drop";
import { AuthContext } from '../context/authContext';

export default function Login({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <Drop />
        <Text style={styles.header}>Bienvenido a Armario Digital</Text>
        <Text style={styles.p}>
          Por favor, inicia sesión para entrar a tu armario
        </Text>
        <View style={styles.inputs}>
          <View style={styles.input}>
            <Text style={styles.inputText}>Correo electrónico</Text>
            <TextInput style={styles.inputField} defaultValue={email} onChangeText={email => setEmail(email)} />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputText}>Contraseña</Text>
            <TextInput style={styles.inputField} secureTextEntry={true} defaultValue={password} onChangeText={pass => setPassword(pass)} />
          </View>
        </View>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button
              title="Iniciar sesión"
              color="white"
              onPress={() => {
                signIn();
                navigation.navigate('Main');
              }}
            />
          </View>
          <View style={styles.button2}>
            <Button title="Registrarse" color="#3498db" onPress={() => navigation.navigate('Register')} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 75,
    color: "white",
    fontWeight: "800",
    fontSize: 35,
    width: "85%",
    lineHeight: 50,
    paddingHorizontal: 25,
  },
  p: {
    marginTop: 70,
    color: "white",
    paddingHorizontal: 25,
    width: "60%",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 110,
  },
  input: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 10,
  },
  inputText: {
    paddingLeft: 10,
    paddingBottom: 5,
    fontWeight: "500",
  },
  inputField: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#3498db",
    padding: 10,
  },
  button: {
    backgroundColor: "#3498db",
    borderRadius: 25,
    padding: 5,
    marginTop: 50,
    width: 180,
  },
  button2: {
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 25,
    padding: 5,
    marginTop: 10,
    width: 180,
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
