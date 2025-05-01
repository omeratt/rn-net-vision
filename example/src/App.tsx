// import { registerNetVisionDevMenu } from '@omeratt/rn-net-vision';
import { useNetVision } from '@omeratt/rn-net-vision';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  useNetVision();

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome To Net Vision!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 32,
    color: '#000',
    letterSpacing: 2,
  },
});
