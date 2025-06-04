// import { registerNetVisionDevMenu } from '@omeratt/rn-net-vision';
import { useNetVision } from '@omeratt/rn-net-vision';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetch, type ReactNativeSSLPinning } from 'react-native-ssl-pinning';

const fetchTo = (
  url: string,
  options: Omit<ReactNativeSSLPinning.Options, 'sslPinning'>
) => {
  return fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'platform': 'mobile',
    },
    sslPinning: {
      certs: ['stringisracard24'],
    },
  });
};

export default function App() {
  useNetVision();

  useEffect(() => {
    fetchTo('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Hello NetVision',
        body: 'This is a test request body',
        userId: 123,
      }),
    });
    fetchTo('https://string.isracard.co.il/DigitalShell.MobileTestBE/GetTest', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('NetVision Response:', JSON.stringify(res));
        // return res.json();
      })
      .catch((error) => {
        console.log('Error:', error);
      });
    fetchTo('https://sellme.app/feed', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Cache-Control': 'no-cache',
      },
    });
    fetchTo('https://jsonplaceholder.typicode.com/posts/1', {});
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
