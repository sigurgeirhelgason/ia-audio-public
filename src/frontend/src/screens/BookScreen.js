import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import metrics from '../util/metrics';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/ui/Button';

function BookScreen({ route }) {
  const navigation = useNavigation();
  // console.log('BookScreen route', route.params.book);
  const book = route.params.book;
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.rootContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: book.image }} />
          </View>
          <Text style={styles.headerText}>{book.title}</Text>
          <View style={styles.textContainer}>
            <Button onPress={() => navigation.navigate('AudioBookScreen', { book: book.id })}>
              <Text style={styles.buttonText}>Spila</Text>
            </Button>
            <Text style={styles.title}>Höfundur: {book.author}</Text>
            <Text style={styles.title}>Útgefandi: {book.publisher}</Text>
            <Text style={styles.bookText}>{book.description}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'flex-start',
    padding: 20,
  },
  rootContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 25,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },

  bookText: {
    fontSize: 15,
    marginTop: metrics.height * 0.01,
    marginBottom: metrics.height * 0.04,
    color: 'white',
  },
  authorText: {
    fontSize: 14,
    marginLeft: metrics.width * 0.02,
    marginTop: metrics.height * 0.01,
    color: 'white',
  },
  image: {
    width: metrics.width * 0.7,
    height: metrics.height * 0.6,
    borderRadius: 3,
    margin: 3,
  },
  imageContainer: {
    marginTop: metrics.height * 0.01,
  },

  textContainer: {
    marginTop: metrics.height * 0.01,
    textAlign: 'center',
    marginBottom: metrics.height * 0.03,
  },
  button: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: metrics.width * 0.6,
    height: metrics.height * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: metrics.height * 0.01,
  },
  buttonText: {
    fontSize: 20,
    color: '#eee',

  },
});
