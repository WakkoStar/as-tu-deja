import React,{useState} from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, Alert, BackHandler, Animated} from 'react-native';
import Data from './Data';
import {connect } from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import { IconOutline } from "@ant-design/icons-react-native";
import { useFocusEffect } from '@react-navigation/native'

function Theme(props) {
    switch (props.theme) {
        case 1: return <Text style={styles.navFonts}>Sexe</Text>;
        case 2: return <Text style={styles.navFonts}>Drogues et alcools</Text>;
        case 3: return <Text style={styles.navFonts}>Hygiène</Text>;
        case 4: return <Text style={styles.navFonts}>Morale</Text>;
        case 5: return <Text style={styles.navFonts}>Social</Text>;
    }
}

function Question(props){

  const [isPressed, setIsPressed] = useState(false);
  const {playerIndex, questionIndex, roundIndex, roundLength} = props.indexes
  const {players} = props;

  useFocusEffect(
    React.useCallback(() => {

      const onBackPress = ()=> {
        confirmQuit();
        return true;
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      setIsPressed(false);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }

    }, []),
  )

  const confirmQuit = () => {
    Alert.alert(
      'Quitter',
      'Voulez-vous quittez la partie ?',
      [
        {text: 'Non', onPress: () => console.log('Cancel pressed'), style: 'cancel'},
        {text: 'Oui', onPress: () => returnToPlayers()}
      ]
    )
  }

  const returnToPlayers = () => {
    Orientation.lockToPortrait();
    props.navigation.navigate('Joueur');
  }

  const colorTheme = () => {
    switch (Data[questionIndex].theme) {
      case 1:
        return "#d4357a";
      case 2:
        return "#4896b5";
      case 3:
        return "#b5a353";
      case 4:
        return "#ad0e0e";
      case 5:
        return "#607275";
      default:
        return "black";
    }
  }


  const setScore = (e, points) => {
    e.preventDefault()
    setIsPressed(true)//disable button to avoid multiple taps
    let score = points * Data[questionIndex].mode;
    //Increment score and question for the player
    const player_selected = {
      id : players[playerIndex].id,
      name: players[playerIndex].name,
      score: players[playerIndex].score + score,
      question: players[playerIndex].question + 1
    };
    const action = { type: "NEXT_QUESTION", value: player_selected};
    props.dispatch(action);

    //If the half of the game is reached
    let infoScore = false;
    if(roundIndex >= roundLength/2) infoScore = getScoreChanges();

    if(infoScore){
      props.navigation.navigate("InfoScore", {infoScore, points});
    }else{
      props.navigation.navigate("Reponse", points);
    }

  }

  const getScoreChanges = () => {
    return false
  }

  const FadeInView = (props) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    React.useEffect(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }
      ).start();
    },[])

    return (
      <Animated.View style={{opacity: fadeAnim}}>
        {props.children}
      </Animated.View>
    );
  }

  return(
      <View style={styles.container} style={{backgroundColor: colorTheme()}} >
          <View style={styles.navbar}>
            <TouchableOpacity style={styles.quitButton} onPress={(e) => returnToPlayers(e)}>
              <IconOutline name="arrow-left" size={25} color="white" />
            </TouchableOpacity>
            <Theme theme={Data[questionIndex].theme}/>
            <Text style={styles.navIcon}>Tour {roundIndex} </Text>
          </View>
          <View style={styles.name}>
            <Text style={{fontFamily: "AvenirNextLTPro-Heavy",fontSize: 40, color: colorTheme(),textAlign: "center"}}>
              {players[playerIndex].name}
            </Text>
          </View>
          <View style={styles.question}>
            <Text style={styles.title}>As-tu déjà</Text>
            <FadeInView>
              <Text style={styles.paragraph}>{Data[questionIndex].data}</Text>
            </FadeInView>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.navButton}
              disabled={isPressed}
              onPress={(e) => setScore(e,0)}>
                <Text style={styles.buttonFont}>JAMAIS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={(e) => setScore(e,1)}
              disabled={isPressed}>
                <Text style={styles.buttonFont}>UNE FOIS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={(e) => setScore(e,2)}
              disabled={isPressed}>
                <Text style={styles.buttonFont}>PLUSIEURS</Text>
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
    navbar: {
      height: "10%",
      width:"100%",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row"
    },
    name: {
      height: "20%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white"
    },
    question: {
      height: "38%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    buttons: {
      height: "32%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around"
    },
    navFonts: {
      fontFamily: "AvenirNextLTPro-Bold",
      fontSize: 20,
      width: "25%",
      color: "white",
      textAlign: "center"
    },
    navIcon: {
      fontFamily: "AvenirNextLTPro-Bold",
      fontSize: 20,
      color: "white",
      textAlign: "center"
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
    quitButton: {
      width: "10%",
      display:"flex",
      alignItems:"center",
      backgroundColor: "transparent"
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
export default connect(mapStateToProps,mapDispatchToProps)(Question);
