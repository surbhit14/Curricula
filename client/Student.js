
import React, { Component } from 'react'
import { Image, StyleSheet, Text, TextInput, Button, View} from 'react-native'
import './global'
import { web3, kit } from './root'
import {   
  requestTxSig,
  waitForSignedTxs,
  requestAccountAddress,
  waitForAccountAuth,
  FeeCurrency
} from '@celo/dappkit'
import { toTxResult } from "@celo/connect"
import * as Linking from 'expo-linking'
import HelloWorldContract from './contracts/HelloWorld.json'

export class Student extends Component {
    state = {
        address: 'Not logged in',
        phoneNumber: 'Not logged in',
        cUSDBalance: 'Not logged in',
        helloWorldContract: {},
        contractName: '',
        textInput: '',
        tacc:'',
        amount:'',
        issponsor:'false',
        rollLoading:'true'
      }

      componentDidMount = async () => {
    
        // Check the Celo network ID
        const networkId = await web3.eth.net.getId();
        
        // Get the deployed HelloWorld contract info for the appropriate network ID
        const deployedNetwork = HelloWorldContract.networks[networkId];
    
        // Create a new contract instance with the HelloWorld contract info
        const instance = new web3.eth.Contract(
          HelloWorldContract.abi,
          deployedNetwork && deployedNetwork.address
        );
    
        // Save the contract instance
        this.setState({ helloWorldContract: instance })
        
        const requestId = 'login'
    
        // A string that will be displayed to the user, indicating the DApp requesting access/signature
        const dappName = 'Hello Celo'
        
        // The deeplink that the Celo Wallet will use to redirect the user back to the DApp with the appropriate payload.
        const callback = Linking.makeUrl('/my/path')
      
        // Ask the Celo Alfajores Wallet for user info
        requestAccountAddress({
          requestId,
          dappName,
          callback,
        })
      
        // Wait for the Celo Wallet response
        const dappkitResponse = await waitForAccountAuth(requestId)
      
        // Set the default account to the account returned from the wallet
        kit.defaultAccount = dappkitResponse.address
      
        
        // Get the stabel token contract
        const stableToken = await kit.contracts.getStableToken()
      
        // Get the user account balance (cUSD)
        const cUSDBalanceBig = await stableToken.balanceOf(kit.defaultAccount)
        
        // Convert from a big number to a string by rounding it to the appropriate number of decimal places
        const ERC20_DECIMALS = 18
        let cUSDBalanceDec = cUSDBalanceBig.shiftedBy(-ERC20_DECIMALS).toFixed(2)
        let cUSDBalance = cUSDBalanceDec.toString()
        
        // Update state
        this.setState({ cUSDBalance, 
                        isLoadingBalance: false,
                        address: dappkitResponse.address, 
                        phoneNumber: dappkitResponse.phoneNumber ,
                        rollLoading:false                
                      })

      }

    render() {
        return (
            <View style={styles.container}>
            <Text style={styles.title}>Account Info:</Text>
            <Text>Current Account Address:</Text>
            <Text>{this.state.address}</Text>
            <Text>Phone number: {this.state.phoneNumber}</Text>
            <Text>cUSD Balance: {this.state.cUSDBalance}</Text>
            </View>
        )
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

export default Student
