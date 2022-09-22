import React, {useEffect, useState} from 'react';
import {
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import {COLORS} from '../constants';
import {useNavigation} from '@react-navigation/native';

export const Quiz = ({route}) => {
  const {id} = route?.params;
  const navigation = useNavigation();

  //En que pregunta se encuentra
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  //La opcion seleccionada en la pregunta, por default null porq al inicio aparecer que no selecciono ninguna
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);

  //Almacenara la opción correcta
  const [correctOption, setCorrectOption] = useState(null);

  //Una vez seleccionada una opcion , esto estara en true, por lo que no se podra seleccionar otra opción
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);

  //Puntaje
  const [score, setScore] = useState(0);

  //Validara si hay una pregunta , si hay, se mostrar el boton de siguiente
  const [showNextButton, setShowNextButton] = useState(false);

  //Estado del modal que aparecera al final de terminar el quiz
  const [showScoreModal, setShowScoreModal] = useState(false);

  //Estado de las preguntas
  const [questionsState, setQuestionsState] = useState([]);

  useEffect(() => {
    getQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderQuestion = () => {
    if (questionsState.length <= 0) {
      return <Text>No data</Text>;
    }
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{marginVertical: 40}}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              color: COLORS.white,
              fontSize: 20,
              opacity: 0.6,
              marginRight: 2,
            }}>
            {currentQuestionIndex + 1}
          </Text>
          <Text style={{color: COLORS.white, fontSize: 18, opacity: 0.6}}>
            / {questionsState.length}
          </Text>
        </View>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            color: COLORS.white,
            fontSize: 30,
          }}>
          {JSON.stringify(questionsState[currentQuestionIndex].descripcion)}
        </Text>
      </View>
    );
  };

  const getQuestions = () => {
    axios
      .get(`http://192.168.1.14:3001/preguntas?cuestionario.id=${id}`)
      .then(resp => {
        console.log('ala', resp.data);
        setQuestionsState(resp.data);
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  const handleNext = () => {
    if (currentQuestionIndex === questionsState.length - 1) {
      //The last question
      setShowScoreModal(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionsDisabled(false);
      setShowNextButton(true);
    }
  };
  const renderNextButton = () => {
    if (showNextButton) {
      return (
        <TouchableOpacity
          onPress={handleNext}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 20,
            backgroundColor: COLORS.accent,
            padding: 20,
            borderRadius: 10,
          }}>
          <Text
            style={{fontSize: 20, color: COLORS.white, textAlign: 'center'}}>
            {currentQuestionIndex + 1 == questionsState.length ? (
              <Text>End</Text>
            ) : (
              <Text>Next</Text>
            )}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const validateAnswer = valueOption => {
    //Recorrer todas las opciones de la pregunta en la posición currentQuestionIndex
    questionsState[currentQuestionIndex]?.opcions.forEach(option => {
      setCurrentOptionSelected(valueOption); //Actualizar la opcion seleccionada
      console.log('option', option);
      if (option.correcto) {
        setCorrectOption(option.nombre); //Valor de la respuesta correcta
      }
      //Validar el valor de la opcion que se ha elegido con todas las opciones de la pregunta
      if (option.nombre === valueOption) {
        setIsOptionsDisabled(true);
        if (option.correcto) {
          console.log('okokokok');
          setScore(score + 1);
        }
      }
    }); // Show Next Button
    setShowNextButton(true);
  };

  const renderOptions = () => {
    if (!questionsState) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View>
        {questionsState[currentQuestionIndex]?.opcions.map(option => (
          <TouchableOpacity
            disabled={isOptionsDisabled}
            onPress={() => validateAnswer(option.nombre)}
            style={{
              borderWidth: 3,
              borderColor:
                option.nombre == correctOption
                  ? COLORS.success
                  : option.nombre == currentOptionSelected
                  ? COLORS.error
                  : COLORS.secondary + '40',
              backgroundColor:
                option.nombre == correctOption
                  ? COLORS.success + '20'
                  : option.nombre == currentOptionSelected
                  ? COLORS.error + '20'
                  : COLORS.secondary + '20',
              height: 'auto',
              paddingVertical: 10,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              marginVertical: 10,
            }}
            key={option.id}>
            <Text style={{fontSize: 20, color: COLORS.white}}>
              {option.nombre}
            </Text>
            {option && option.nombre == correctOption ? (
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30 / 2,
                  backgroundColor: COLORS.success,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>V</Text>
              </View>
            ) : option && option.nombre == currentOptionSelected ? (
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30 / 2,
                  backgroundColor: COLORS.error,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>X</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          paddingBottom: 40,
          paddingHorizontal: 16,
          backgroundColor: COLORS.background,
          position: 'relative',
        }}>
        <View style={{marginBottom: 40}}>
          {renderQuestion()}
          {renderOptions()}
          {renderNextButton()}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showScoreModal}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flex: 1,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                backgroundColor: COLORS.white,
                width: '90%',
                borderRadius: 20,
                padding: 20,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                {score}/{questionsState.length}
              </Text>
              <Button
                onPress={() => navigation.navigate('Options')}
                title="Ir al inicio"
              />
              {score === questionsState.length ? (
                <Text>Puntaje perfecto</Text>
              ) : (
                <Text>Estudia vago</Text>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
