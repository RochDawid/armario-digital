import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Splash() {
    return <View style={styles.splash} />;
}

const styles = StyleSheet.create({
    splash: {
        backgroundColor: "#3498db",
        position: "absolute",
        height: 2000,
        width: 2000,
        borderRadius: 500,
        top: -1625,
        left: -1550,
      },
});
