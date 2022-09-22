import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../constants';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

export const Options = () => {
  const navigation = useNavigation();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = () => {
    const url = process.env;
    console.log('url', url);

    setLoading(true);
    axios
      .get('http://192.168.1.14:3001/tipo-cuestionarios')
      .then(resp => {
        setLoading(false);
        setOptions(resp.data);
      })
      .catch(err => {
        console.log('error', err);
        setLoading(false);
      });
  };

  const handleNavigator = value => {
    navigation.navigate('Suboptions', {
      tipo: value,
    });
  };
  if (loading) {
    return <Text>Cargando...</Text>;
  }
  return (
    <View style={style.container}>
      {options.length > 0 ? (
        options.map(option => {
          return (
            <View key={option.id} style={style.item}>
              <TouchableOpacity
                onPress={() => handleNavigator(option.nombre)}
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
