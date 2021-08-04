import React, { useState } from "react";
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
import { auth } from "../others/firebase";

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({ displayName: name }).then(() => {
          navigation.replace("Home");
        });
      })
      .catch(() =>
        alert(
          "Ocurrió un error, por favor comprueba que no exista una cuenta ya asociada al correo introducido y que los datos tengan el formato adecuado."
        )
      );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <Drop bottom={false} />
        <Text style={styles.header}>Bienvenido a Armario Digital</Text>
        <Text style={styles.p}>
          Por favor, regístrate para disfrutar de la aplicación
        </Text>
        <View style={styles.inputs}>
          <View style={styles.input}>
            <Text style={styles.inputText}>Nombre</Text>
            <TextInput
              style={styles.inputField}
              defaultValue={name}
              onChangeText={(na) => setName(na)}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputText}>Correo electrónico</Text>
            <TextInput
              style={styles.inputField}
              defaultValue={email}
              onChangeText={(em) => setEmail(em)}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputText}>Contraseña</Text>
            <TextInput
              style={styles.inputField}
              secureTextEntry={true}
              defaultValue={password}
              onChangeText={(pass) => setPassword(pass)}
            />
          </View>
        </View>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button
              title="Registrarse"
              color="white"
              onPress={() => {
                register();
              }}
            />
          </View>
          <View style={styles.button2}>
            <Button
              title="Iniciar sesión"
              color="#3498db"
              onPress={() => navigation.replace("Login")}
            />
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
