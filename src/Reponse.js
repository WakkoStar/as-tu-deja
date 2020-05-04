import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Alert,
  Animated,
} from 'react-native';
import Data from './Data';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import {useFocusEffect} from '@react-navigation/native';

function Reponse(props) {
  let {roundIndex, roundIndicator, roundLength, questionIndex} = props.indexes;
  const [isPressed, setIsPressed] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        confirmQuit();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      setIsPressed(false);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  const confirmQuit = () => {
    Alert.alert('Quitter', 'Voulez-vous quittez la partie ?', [
      {
        text: 'Non',
        onPress: () => console.log('Cancel pressed'),
        style: 'cancel',
      },
      {text: 'Oui', onPress: () => returnToPlayers()},
    ]);
  };

  const returnToPlayers = () => {
    Orientation.lockToPortrait();
    props.navigation.navigate('Joueur');
  };

  const NextScreen = () => {
    let reponse = '';

    switch (props.route.params) {
      case 0:
        reponse = Data[questionIndex].reponse_0;
        break;
      case 1:
        reponse = Data[questionIndex].reponse_1;
        break;
      case 2:
        reponse = Data[questionIndex].reponse_2;
        break;
      default:
        reponse = 'Suivant';
    }
    return <Text style={styles.paragraph}>{reponse}</Text>
  };

  const FadeInView = (props) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    return (
      <Animated.View style={{opacity: fadeAnim}}>
        {props.children}
      </Animated.View>
    );
  };

  const nextQuestion = () => {
    setIsPressed(true);

    //Increment roundIndicator
    roundIndicator += 1;
    //everybody played > we can increment to the next round
    if (roundIndicator >= props.players.length) {
      roundIndicator = 0;
      roundIndex += 1;
    }

    //array of players who don't response
    const currentPlayers = props.players.filter(
      player => player.question < roundIndex,
    );
    let rand = Math.floor(Math.random() * currentPlayers.length);
    //find index of the current player
    const playerIndex = props.players.findIndex(
      item => item.id === currentPlayers[rand].id,
    );

    //set new indexes
    const indexes_next = {
      playerIndex,
      questionIndex: Math.floor(Math.random() * Data.length),
      roundLength,
      roundIndex,
      roundIndicator,
    };

    //Set the game
    const action = {type: 'SET_GAME', value: indexes_next};
    props.dispatch(action);

    //display score or response
    if (roundIndex > roundLength) {

      //go to the score screen
      Orientation.lockToPortrait();
      props.navigation.navigate('Score');

    } else {

        //Set bonus
        const {bonusActive} = props.bonus
        if(bonusActive){
          const bonus = {
            bonusActive,
            roundIndicator: props.bonus.roundIndicator - 1
          }
          const action = { type: "SET_BONUS", value: bonus};
          props.dispatch(action);
        }

        //navigate
        //10% of chances to get an Bonus
        const addBonusRandom = Math.random() * (100 - 0);
        if(addBonusRandom <= 10 && !bonusActive){
            props.navigation.navigate('Event');
        //Rounds of the bonus is finished
        }else if(props.bonus.roundIndicator == 0 && bonusActive){
            props.navigation.navigate('EndEvent');
        //Nothing
        } else {
          props.navigation.navigate('Question');
        }
    }
  };

  return (
    <View style={styles.container} style={{backgroundColor: '#32194d'}}>
      <View style={styles.reponse}>
        <FadeInView>
          <NextScreen />
        </FadeInView>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.navButton}
          disabled={isPressed}
          onPress={() => nextQuestion()}>
          <Text style={styles.buttonFont}>SUIVANT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  reponse: {
    height: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  buttons: {
    height: "30%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  title: {
    fontFamily: "AvenirNextLTPro-Bold",
    fontSize: 35,
    color: "white",
    textAlign: "center"
  },
  paragraph: {
    fontFamily: "AvenirNextLTPro-Regular",
    fontSize: 20,
    paddingHorizontal: "10%",
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
    fontSize: 20,
  },
});

const mapStateToProps = state => {
  return {
    players: state.handlePlayer.players,
    indexes: state.handleIndex.indexes,
    bonus: state.handleBonuses.bonus
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch: action => {
      dispatch(action);
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reponse);
