import React,{useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, BackHandler,} from 'react-native';
import Data from './Data'
import {connect} from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'

function Score(props){

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const players = props.players.sort(function (a, b) {
      return b.score - a.score;
    });
    setPlayers(players)
  }, []);

  useFocusEffect(
    React.useCallback(() => {

      const onBackPress = () => {
        return true;
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }

    }, [])
  )

  const replayGame = (e) => {
    e.preventDefault();

    const indexes_start = {
      playerIndex: Math.floor(Math.random() * (props.players.length)),
      questionIndex : Math.floor(Math.random() * (Data.length)),
      roundLength: 3,
      roundIndicator: 0,
      roundIndex: 1
    }

    //Reset players
    const action_1 = {type: 'RESET_PLAYER'};
    props.dispatch(action_1);

    //Change question
    const action_2 = {type: 'SET_GAME', value: indexes_start};
    props.dispatch(action_2);

    //Go to question
    props.navigation.navigate('Joueur');
  }

  return(
      <View style={styles.container} style={{backgroundColor: '#32194d'}} >
          <Text style={styles.title}>Fin de la partie</Text>
          <View style={styles.menu}>
          {
            players.map(
              (player, index) => {
                let width = Math.round(Number(player.score) / Number(players[0].score) * 100) / 2
                if(isNaN(width)) width = 50
                return(
                  <View key={index} style={styles.score}>
                    <Text style={styles.scoreFont}>{player.name}</Text>
                    <View style={{backgroundColor: 'white',flex: width/100}}>
                      <Text style={styles.scorePoints}>{player.score}</Text>
                    </View>
                  </View>
                )
              }
            )
          }
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.navButton} onPress={(e) => replayGame(e)}>
              <Text style={styles.buttonFont}>REJOUER</Text>
            </TouchableOpacity>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menu: {
    height: '60%',
    width:'100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: "20%",
  },
  score:{
    marginTop: '5%',
    flexDirection: "row",
    alignItems: "center",
  },
  scoreFont: {
    color: 'white',
    fontSize: 17,
    width: '30%',
    fontFamily: 'AvenirNextLTPro-Regular',
    marginRight: '2%'
  },
  scorePoints: {
    color: '#32194d',
    fontSize: 17,
    flex: 1,
    textAlign: 'right',
    marginRight: "5%",
    fontFamily: 'AvenirNextLTPro-Bold',
  },
  title: {
    fontFamily: 'AvenirNextLTPro-Bold',
    height: '10%',
    fontSize: 35,
    color: 'white',
    textAlign: 'center',
    marginTop: '6%',
    marginBottom: '6%'
  },
  buttons: {
    height: '25%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  navButton: {
    backgroundColor: 'rgba(0,0,0,0.13)',
    padding: '3%',
    width: '60%',
  },
  addButton:{
    backgroundColor: 'rgba(0,0,0,0.13)',
    padding: '3%',
    width: '100%',
    marginTop: '10%'
  },
  buttonFont: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Raleway-Bold',
    fontSize: 20
  }

});

const mapStateToProps = (state) => {
  return {
    players : state.handlePlayer.players,
    indexes : state.handleIndex.indexes
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Score)
