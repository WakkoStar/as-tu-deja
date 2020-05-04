import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, Alert, BackHandler, Animated} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {connect } from 'react-redux';

function Event(props) {

  const [isPressed, setIsPressed] = useState(false);

  const nextQuestion = (e) => {
    e.preventDefault();
    setIsPressed(true);
    //create a new bonus
    const bonus = {
      bonusActive: true,
      roundIndicator: 6
    };
    const action = { type: "SET_BONUS", value: bonus};
    props.dispatch(action);

    props.navigation.navigate('Question')
  }

  return (
    <View style={styles.container,{backgroundColor: '#32194d'}} >
      <View style={styles.event}>
        <Text style={styles.title}>Bonus/Malus</Text>
        <Text style={styles.paragraph}>Les gorgées bues sont remplacées en distribués pour ceux qui répondent PLUSIEURS</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={(e) => nextQuestion(e)}
          disabled={isPressed}>
            <Text style={styles.buttonFont}>COMPRIS</Text>
        </TouchableOpacity>
      </View>
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
    title: {
      fontFamily: "AvenirNextLTPro-Bold",
      fontSize: 35,
      color: "white",
      textAlign: "center",
    },
    paragraph: {
      fontFamily: "AvenirNextLTPro-Regular",
      fontSize: 20,
      paddingHorizontal: '10%',
      color: "white",
      textAlign: "center"
    },
    navButton: {
      backgroundColor: "rgba(0,0,0,0.13)",
      padding: "3%",
      width: '23%',
    },
    buttonFont: {
      textAlign: "center",
      color: "white",
      fontFamily: "Raleway-Bold",
      fontSize: 20
    },
    buttons: {
      height: "32%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around"
    },
    event: {
      height: "70%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
})

const mapStateToProps = (state) => {
  return {
    players : state.handlePlayer.players,
    indexes : state.handleIndex.indexes,
    bonus : state.handleBonuses.bonus
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Event);
