import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Image, Text } from 'react-native';
import metrics from '../../util/metrics';
import { useNavigation } from '@react-navigation/native';

export default ImageList = ({ images }) => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.imageList}
      onPress={() =>
        navigation.navigate('Book', {
          book: item,
        })
      }
    >
      <Image style={styles.image} source={{ uri: item.image }} />
      <Text style={styles.text}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      numColumns={2}
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: metrics.width * 0.4,
    height: metrics.height * 0.3,
    borderRadius: 10,
  },
  imageList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: metrics.height * 0.035,
  },
  text: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 2,
  },
});
