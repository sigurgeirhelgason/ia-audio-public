import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
} from 'react-native';

import metrics from '../../util/metrics';
import Button from '../ui/Button';

export default function Crossroads({ crossroad, roads: roadCollection, onClickFunction, goToPrev }) {


  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{crossroad.text}</Text>
    </View>
    <View style={styles.roads}>
      <FlatList
        data={roadCollection}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => onClickFunction(item.next_chapter)}
          >
            <Text style={styles.buttonText}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
    <View style={styles.backButton}>
      <Button title="Til baka" onPress={() => goToPrev()}>
          <Text style={styles.buttonText}>Til baka</Text>
        </Button>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  roads: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },

  titleText: {
    color: 'snow',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 80,
    textAlign: 'center',
    margin: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },


  buttonContainer: {
    flex: 1,
    alignContent: 'center',
  },

  button: {
    margin: 10,
    padding: 10,
    backgroundColor: 'gray',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  image: {
    width: metrics.width * 0.5,
    height: metrics.height * 0.5,
    borderRadius: 3,
    margin: 3,
  },
  container: {
    flex: 1,
  },
  backButton: {
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    width: metrics.width * 0.3,
  },
  roads: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 50,
    paddingRight: 50,
  },



});
