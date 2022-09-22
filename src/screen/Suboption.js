import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {COLORS} from '../constants';

export const Suboption = ({route}) => {
  const navigation = useNavigation();
  const {tipo} = route?.params;
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    //Traer los cuestionarios por el tipo-seleccionado
    getQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleNavigator = value => {
    navigation.navigate('Quiz', {
      id: value.id,
    });
  };
  const getQuiz = () => {
    axios
      .get(
        `http://192.168.1.14:3001/cuestionarios?tipo_cuestionario.nombre=${tipo}`,
      )
      .then(resp => {
        setQuizzes(resp.data);
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  return (
    <View style={style.container}>
      {quizzes.length > 0 ? (
        quizzes.map(option => {
          return (
            <View key={option.id} style={style.item}>
              <TouchableOpacity
                onPress={() => handleNavigator(option)}
                style={style.touch}>
                <Text style={{color: COLORS.white}}>{option.nombre}</Text>
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <ActivityIndicator color={'skyblue'} size="large" />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
  },
  item: {
    width: '40%',
    backgroundColor: '#7B42DB',
    height: 120,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  touch: {
    width: 110,
    height: 110,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
