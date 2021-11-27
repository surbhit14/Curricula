import React from 'react'
import './global'
import { Image, StyleSheet, Text, TextInput, Button, View } from 'react-native'

export default class App extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login for Sponsors</Text>
        <Button title="Login" 
          onPress={()=> this.props.navigation.navigate('Sponsor')} />

<Text style={styles.title}>Login for Students</Text>
        <Button title="Login" 
          onPress={()=> this.props.navigation.navigate('Student')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#35d07f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold'
  }
});