
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ListView,
  Platform,
  Alert,
  AsyncStorage
} from 'react-native';

import * as firebase from 'firebase'

var config = {
    apiKey: "AIzaSyBTKPfxmGDQC38vWKsoRYscTqLO7sQve_I",
    authDomain: "react-9762e.firebaseapp.com",
    databaseURL: "https://react-9762e.firebaseio.com",
    storageBucket: "react-9762e.appspot.com",
    messagingSenderId: "998207864178"
   };

const firebaseApp = firebase.initializeApp(config);

import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

// var data=[
//   {name:"Go to CarnesAlejo",color:"#f6808a",fontSize:28,height:130},
//   {name:"Play games",color:"#fec487",fontSize:20,height:75},
//   {name:"Go to PP",color:"#46e2c0",fontSize:20,height:75},
// ];

import SwipeRowButtons from "./swipe_buttons"


export default class Todo extends Component {


  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state= {
      dataSource:ds ,
      code:'',
      text:'',
      datas:[],
    }
    this.color=[
      "#f6808a",
      "#fec487",
      "#46e2c0",
      "#ca98ec",
    ];
    this.numbercolor=0;
    this.itemsRef = this.getRef().child('items');

  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({key:child.key,...child.val()});
      });
      this.store(items)
    });
  }

  async store(items){
    var data= JSON.stringify(items)
    await AsyncStorage.setItem('@Items:data',data);
    console.log("update");
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(items),
      datas:items
    });

  }

  async getSotore(){
    try {
      var items= await AsyncStorage.getItem("@Items:data")
      items= JSON.parse(items)
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items),
        datas:items
      })
    } catch (e) {

    }
  }

  componentDidMount() {
    this.getSotore()
    this.listenForItems(this.itemsRef);
  }

  renderList(data){
    data.color=this.color[this.numbercolor]
    if(this.numbercolor>=this.color.length)this.numbercolor=0;
    this.numbercolor++;
    return (
      <View style={[styles.mainContainer,{height:data.height}]}>
        <View style={{flex:1,flexDirection:"row"}}>

          <View>
            <View style={styles.checkContainer}/>
          </View>

          <View style={styles.detailContainer}>
              <Text style={{color:"#fff",fontSize:data.fontSize}}>{data.name}</Text>
          </View>

          <View style={{flex:1,alignItems:"flex-end"}}>
              <View style={{flex:1,backgroundColor:data.color,width:8,justifyContent:"flex-end"}}/>
          </View>

        </View>
      </View>
    )
  }

  add(){
    if(this.state.text!=''){
      this.itemsRef.push({name:this.state.text,color:"#f6808a",fontSize:20,height:75})
      this.setState({text:''})
    }

  }

  list(){
    return(
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(data)=>this.renderList(data)}
        renderHiddenRow={(data, secId, rowId, rowMap)=>{
          <SwipeRowButtons
            log={"hola"}
            onPressEdit={() => console.log("tns papas")}
            onPressDelete={()=> console.log('delte')}
          />
        }}
        leftOpenValue={75}
        disableRightSwipe={true}
        rightOpenValue={-150}
        />
    )
  }

  loading(){
    return(
      <Text>loading... </Text>
    )
  }

  render() {
    return (
      <View >
        <View>
          <TextInput
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}/>
          <TouchableOpacity onPress={()=>this.add()} >
            <Text>Add</Text>
          </TouchableOpacity>
          {
            (this.state.dataSource.rowIdentities.length==0)?this.loading():this.list()
          }
        </View>


      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderWidth:1
  },
  add:{
    flex:1,
    justifyContent:"center",
    alignItems:'flex-start',
    flexDirection:"row",
    borderWidth:1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  camera: {
  flex: 1
},
rectangleContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent'
},
rectangle: {
  height: 250,
  width: 250,
  borderWidth: 2,
  borderColor: '#00FF00',
  backgroundColor: 'transparent'
},
mainContainer:{
  backgroundColor:"#4d556b",
  flex:1,
  borderBottomWidth:0.5,
  borderColor:"#7a7c88"
},
checkContainer:{
  flex:1,
  backgroundColor:"#44495b",
  width:40,
  justifyContent:"flex-end"
},
detailContainer:{
  justifyContent:"center",
  alignItems:"flex-start",
  marginLeft:10,
  paddingLeft:10}
});

AppRegistry.registerComponent('Todo', () => Todo);
