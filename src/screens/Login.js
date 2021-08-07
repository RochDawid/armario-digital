import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from "react-native";
import Drop from "../components/Drop";
import { auth } from '../others/firebase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace('Home');
      }
    });

    return unsubscribe;
  }, []);

  const login = () => {
    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      navigation.replace('Home');
    })
    .catch(() => alert('El correo o la contraseña introducidos no son correctos o no tienen el formato adecuado.'));
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ backgroundColor: "#202832", flex: 1 }}>
        <Drop bottom={false} />
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
              color="#E9EDE9"
              onPress={() => login()}
            />
          </View>
          <View style={styles.button2}>
            <Button title="Registrarse" color="#1BB2EC" onPress={() => navigation.replace('Register')} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 75,
    color: "#E9EDE9",
    fontWeight: "800",
    fontSize: 35,
    width: "85%",
    lineHeight: 50,
    paddingHorizontal: 25,
  },
  p: {
    marginTop: 70,
    color: "#E9EDE9",
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
    color: "#E9EDE9"
  },
  inputField: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#1BB2EC",
    padding: 10,
    color: "#E9EDE9",
  },
  button: {
    backgroundColor: "#1BB2EC",
    borderRadius: 25,
    padding: 5,
    marginTop: 50,
    width: 180,
  },
  button2: {
    borderWidth: 1,
    borderColor: "#1BB2EC",
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
