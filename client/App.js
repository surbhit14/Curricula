import React from 'react'
import { Image, StyleSheet } from 'react-native'

import {NavigationContainer} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"

const Stack=createStackNavigator()
import Login from './Login'
import Sponsor from './Sponsor'
import Student from './Student'

export default class App extends React.Component {
  render(){
    return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Sponsor" component={Sponsor}/>
      <Stack.Screen name="Student" component={Student}/>
      </Stack.Navigator>

    </NavigationContainer>
    );
  }
}

