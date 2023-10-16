/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type SectionProps = PropsWithChildren<{
  title: string;
}>;



function App(): JSX.Element {

  // define state where I'll save 
  // login & password
  const[login, setLogin] = useState("");
  const[password, setPassword] = useState("");

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    firestore().collection('Animals')
    .onSnapshot(
      querySnapshot => {
        console.log("****************************");
        querySnapshot.forEach(currentDoc => {
          console.log(currentDoc.id, currentDoc.data());
        });
      },
      error => {
        console.error(error);
      }
    );
  }, []);
  

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <TextInput 
        placeholder='login'
        onChangeText={text => {
          setLogin(text);
        }}
      />
      <TextInput
        placeholder='password'
        secureTextEntry={true}
        onChangeText={text => {
          setPassword(text);
        }}
      />
      <Button 
        title='Sign up'
        onPress={() => {
          // then - method that is a part of a promise object in which
          // we can register logic to be run when async task is done 
          auth()
          .createUserWithEmailAndPassword(login, password)
          .then(() => {
            console.log("SIGNED UP SUCCESSFULLY!");
          })
          .catch(error => {
            if(error.code === 'auth/email-already-in-use'){
              console.log('email already used');
            }
            if(error.code === 'auth/invalid-email'){
              console.log('invalid email');
            }
            console.log(error.code);
          });
        }}
      />
      <Button 
        title='Log in'
        onPress={() => {
          auth().signInWithEmailAndPassword(login, password)
          .then(() => {
            console.log("USER SIGNED IN: " + auth().currentUser?.uid);
          })
          .catch(error => {
            console.log("ERROR: " + error);
          });
        }}
      />
      <Button 
        title='Log out'
        onPress={() => {
            auth()
            .signOut()
            .then(() => {
              console.log("SIGNED OUT!");
            });
        }}
      />
      <Button 
        title='new record'
        onPress={() => {
          firestore()
          .collection('Animals')
          .add({
            name: 'Firulais',
            age: 2,
            weight: 5.2
          })
          .then(() => {
            console.log("animal added!");
          });
        }}
      />
      <Button 
        title='query'
        onPress={() => {
          firestore()
          .collection('Animals')
          .get()
          .then(querySnapshot => {
            console.log("****************************");
            querySnapshot.forEach(currentDoc => {
              console.log(currentDoc.id, currentDoc.data());
            });
          });
        }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
