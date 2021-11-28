
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
        amount:5,
        issponsor:'false',
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

      pay=async()=>{

        // Create the transaction object
    const stableToken = await kit.contracts.getStableToken();
    const decimals = await stableToken.decimals();
    // This can be a specific account address, a contract address, etc.
    //const transferTo = '0x528f73287f797d1625469f0809dcc0a52f9748b9'
    const transferTo = '0x11dc2d2e8d3f7e330d0ac451178145a7f97f9167';
    const transferValue = this.state.amount;
    //const transferValue = new BigNumber("10e18");
    const txObject = stableToken.transfer(transferTo, transferValue.toString()).txo;
    
    const requestId = "transfer";
    const dappName = "Hello Celo";
    const callback = Linking.makeUrl("/my/path");
    
    // Request the TX signature from DAppKit
    requestTxSig(
      kit,
      [
        {
          tx: txObject,
          from: this.state.address,
          to: stableToken.contract.options.address,
          feeCurrency: FeeCurrency.cUSD,
        },
      ],
      { requestId, dappName, callback }
    );
    
    const dappkitResponse = await waitForSignedTxs(requestId);
    const rawTx = dappkitResponse.rawTxs[0];
    
    // Send the signed transaction via the kit
    const tx = await kit.connection.sendSignedTransaction(rawTx);
    const receipt = await tx.waitReceipt();
    
  
    let cUSDBalanceDec = cUSDBalanceBig.shiftedBy(-ERC20_DECIMALS).toFixed(2)
    let cUSDBalance = cUSDBalanceDec.toString()
    this.setState({
      cUSDBalance
    });
    
    }

    render() {
        return (
            <View style={styles.container}>
              <Text style={styles.title}>Name: Rahul Singh</Text>
              <Text style={styles.title}>Sponsored by: Vinay Sports</Text>
              <Text style={styles.title}>Activity: Football</Text>
            <Text style={styles.title}>Account Info:</Text>
            
            <Text>Address:</Text>
            <Text style={{fontSize:15}}>{this.state.address}</Text>
            <Text style={{fontSize:15,marginVertical:3}}>Phone number: {this.state.phoneNumber}</Text>
            <Text style={{fontSize:15,marginVertical:3}}>cUSD Balance: {this.state.cUSDBalance}</Text>
            <View style={styles.container2}>
            <Text style={styles.title}>Products Available by your Sponsor:</Text>
            <Image source={require('./images/d.jpg')} style={{ height:120 ,width:150}}></Image>
            <Text>Nike Adapt Shoes </Text>
            <Text>Price: 5 cUSD</Text>
            <Button title="Buy" onPress={()=> this.pay()} />

            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,

      alignItems: 'center',
      justifyContent: 'center',
    },
    container2: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      marginVertical: 6, 
      fontSize: 20, 
      fontWeight: 'bold'
    }
  });

export default Student
