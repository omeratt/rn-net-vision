// import { registerNetVisionDevMenu } from '@omeratt/rn-net-vision';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useNetVision, testRequest } from '@omeratt/rn-net-vision';

export default function App() {
  const isReady = useNetVision();

  useEffect(() => {
    testRequest();
    setTimeout(() => {
      fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then((res) => res.json())
        .then((res) => {
          console.log(res, 'asdasdasdasd@@@@@');
        })
        .catch(console.error);
    }, 7000);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {+isReady}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
