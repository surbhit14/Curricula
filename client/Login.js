import React from 'react'
import './global'
import { Image, StyleSheet, Text, TextInput, Button, View } from 'react-native'

export default class App extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Curricula</Text>
        <View style={styles.container2}> 
        <Text  style={{width:200,fontSize: 20, }}>Platform for students to get rewarded for their extracurricular activites
        and for companies to get publicity
        </Text>
        <Image source={require('./images/c.png')} style={{ height:120 ,width:100}}></Image>
        </View>
        <Text style={{margin:2,fontSize:15,textAlign: 'center'}}>Companies can sponsor selected students by providing them cUSD.
          These cUSD then can be used by students to purchase some products by their respective sponsors
        </Text>
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
    alignItems: 'center',
  },
  container2: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:"row",
    margin:30
  },
  title: {
    marginVertical: 5, 
    fontSize: 20, 
    fontWeight: 'bold',
    margin:5
  }
});