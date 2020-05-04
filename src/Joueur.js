import React, { useState } from 'react';
import {StyleSheet, Text, View, Button, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import {connect } from 'react-redux';
import Data from './Data';
import Orientation from 'react-native-orientation-locker';
import { IconOutline } from "@ant-design/icons-react-native";
import { useFocusEffect } from '@react-navigation/native'
import NumericInput from 'react-native-numeric-input'

function Joueur(props){

  useFocusEffect(
    React.useCallback(() => {
      Orientation.lockToPortrait();
    }, [])
  )

  const [id, setId] = useState(0);
  const [roundLength, setRoundLength] = useState(10);

  const modifyPlayer = (e, id, name) => {
    e.preventDefault();

    const player_selected = {
      id,
      name,
      score: 0,
      question: 0
    }

    const action = { type: "MODIFY_PLAYER", value: player_selected };
    props.dispatch(action);
  }

  const addPlayer = (e) => {
    e.preventDefault();

    const player_new = {
      id : id + 1,
      name: '',
      score: 0,
      question: 0
    }
    //INCREMENT GLOBAL ID
    setId(id+1);

    const action = { type: "ADD_PLAYER", value: player_new};
    props.dispatch(action);
  }

  const deletePlayer = (e, id) => {
    e.preventDefault();
    const player_deleted = {
      id: id,
      name: '',
      score: 0,
      question: 0
    }

    const action = { type: "SUPPR_PLAYER", value: player_deleted};
    props.dispatch(action);
  }

  const beginPlay = (e) => {
    e.preventDefault();

    const indexes_start = {
      playerIndex: Math.floor(Math.random() * (props.players.length)),
      questionIndex : Math.floor(Math.random() * (Data.length)),
      roundLength,
      roundIndex: 1,
      roundIndicator: 0,
    }

    const action = { type: "SET_GAME", value: indexes_start};
    props.dispatch(action);

    //Reset players
    const action_1 = { type: "RESET_PLAYER"};
    props.dispatch(action_1);

    //Bonus set
    const bonus = {
      bonusActive: false,
      roundIndicator: 0
    }
    const action_2 = { type: "SET_BONUS", value: bonus};
    props.dispatch(action_2);
    
    Orientation.lockToLandscape();
    props.navigation.navigate('Question');
  };

  const BeginButton = () => {
    let isEmpty = false;

    props.players.map(
      (player) => {
        if(player.name === "") isEmpty = true
      }
    )

    if(!isEmpty && props.players.length > 0){
      return (
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.navButton} onPress={(e) => beginPlay(e)}>
            <Text style={styles.buttonFont}>COMMENCER</Text>
          </TouchableOpacity>
        </View>
      );
    }else if(props.players.length <= 2){
      return(
        <View style={styles.buttons}>
            <Text style={styles.buttonFont}>Vous devez ajouter plus de joueurs</Text>
        </View>
      );
    } else if (props.players.length > 14) {
      return(
        <View style={styles.buttons}>
            <Text style={styles.buttonFont}>Trop de joueurs !</Text>
        </View>
      );
    }else if(isEmpty){
      return(
        <View style={styles.buttons}>
            <Text style={styles.buttonFont}>Vous devez remplir les champs</Text>
        </View>
      );
    }
  }

return(
    <View style={styles.container} style={{backgroundColor: "#32194d"}} >
        <View style={styles.menu}>
        <Text style={styles.title}>Joueurs</Text>
        <Text style={styles.buttonFont}>Nombre de tours :</Text>
        <NumericInput
          type='up-down'
          minValue={1}
          maxValue={20}
          totalHeight={80}
          editable={false}
          onChange={value => setRoundLength(value)}
          borderColor="transparent"
          textColor="white"
          upDownButtonsBackgroundColor="transparent"
          iconStyle={{color: "white", width: "100%"}}
          inputStyle={styles.input}
          value={roundLength}
          />
        <ScrollView>
          {
            props.players.map(
              (player, index) => {
                return (
                  <View key={index} style={styles.playersView}>
                    <TextInput
                      value={player.name}
                      style={styles.input}
                      placeholder="Entrez votre nom..."
                      placeholderTextColor="#f2f2f0"
                      onChange={(e) => modifyPlayer(e, player.id, e.nativeEvent.text)}/>
                    <TouchableOpacity style={styles.supprButton} onPress={(e) => deletePlayer(e, player.id)}>
                      <IconOutline name="close-circle" size={23} color="white" />
                    </TouchableOpacity>
                  </View>
                )
              }
            )
          }
          <TouchableOpacity style={styles.addButton} onPress={(e) => addPlayer(e)}>
            <Text style={styles.buttonFont}>AJOUTER</Text>
          </TouchableOpacity>
        </ScrollView>
        </View>
        <BeginButton />
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  menu: {
    height: "75%",
    width:"70%",
    marginLeft: "15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    color: "white",
    fontSize: 25,
    width: "80%",
    padding: 0,
    height: "50%",
    marginTop: 0,
    fontFamily: "AvenirNextLTPro-Regular",
  },
  playersView: {
    display: "flex",
    width: "100%",
    height: 70,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderBottomWidth: 2,
    borderBottomColor: "white"
  },
  supprButton:{
    width: "20%",
    display:"flex",
    alignItems:"flex-end",
    height: "40%",
    borderBottomColor: "white",
  },
  title: {
    fontFamily: "AvenirNextLTPro-Bold",
    fontSize: 35,
    color: "white",
    textAlign: "center",
    marginTop: "8%",
    marginBottom: "8%"
  },
  buttons: {
    height: "25%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  navButton: {
    backgroundColor: "rgba(0,0,0,0.13)",
    padding: "3%",
    width: '60%',
  },
  addButton:{
    backgroundColor: "rgba(0,0,0,0.13)",
    padding: "3%",
    width: '100%',
    marginTop: "10%"
  },
  buttonFont: {
    textAlign: "center",
    color: "white",
    fontFamily: "Raleway-Bold",
    fontSize: 20
  }

});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

const mapStateToProps = (state) => {
  return {
    players : state.handlePlayer.players,
    indexes : state.handleIndex.indexes,
    bonus: state.handleBonuses.bonus,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Joueur);
