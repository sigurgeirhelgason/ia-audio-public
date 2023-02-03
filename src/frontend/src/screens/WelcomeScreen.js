import { StyleSheet, View } from 'react-native';
import metrics from '../util/metrics';
import ImageList from '../components/ui/ImageList';
import useFetchBooks from '../hooks/use-fetch-books';
import LoadingOverlay from '../components/ui/LoadingOverlay';

function WelcomeScreen() {
  const { books, loading } = useFetchBooks();

  return (
    <View style={styles.container}>
      {loading ? <LoadingOverlay message={'Hleð inn bókum'} /> : <ImageList images={books} />}
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
