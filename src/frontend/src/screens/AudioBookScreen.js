import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import Crossroad from '../components/ui/Crossroad';
import Player from './Player';
import { BookContext } from '../store/book-context';
import metrics from '../util/metrics';

export default function AudioBookScreen({ route }) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booksReady, setBooksReady] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(1);

  //const [chapters, setChapters] = useState('');
  const [audio, setAudio] = useState('');
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentCrossroad, setCurrentCrossroad] = useState(0);
  const [storyPath, setStoryPath] = useState([]);

  const bookRoute = route.params.book;

  // book-context
  const { chapters, crossroads, roads, isLoading, setBookId } = useContext(BookContext);

  useEffect(() => {
    setBookId(bookRoute);
  }, []);

  useEffect(() => {
    if (currentChapter === 0 && isLoading === false) {
      findIsStart();
    }
  }, [isLoading, storyPath]);

  ////////////////////////////Path controllers/////////////////////////////////////

  //Finds object in given object array
  function findObjectById(objects, id) {
    return objects.find((object) => object.id === id);
  }

  // Finds the starting chapter of the book
  function findIsStart() {
    setLoading(true);
    for (let i = 0; i < chapters.length; i++) {
      if (chapters[i].is_start === true) {
        setAudio(chapters[i].audio);
        setCurrentChapter(chapters[i]);
        addToPath(chapters[i]);
        setLoading(false);
      }
    }
  }

  function setCurrentChapterUsingId(id) {
    let chapter = findObjectById(chapters, id);
    setCurrentChapter(chapter);
    setCurrentCrossroad(0);

    setAudio(chapter.audio);
    addToPath(chapter);
  }

  //Adds chapter or crossroad to current story path
  function addToPath(object) {
    let newPath = [...storyPath];
    newPath.push(object);
    setStoryPath(newPath);
  }

  //sets current from next
  function goToNext() {
    let next;
    if (currentChapter.next_crossroad !== null) {
      next = findObjectById(crossroads, currentChapter.next_crossroad);
      setCurrentCrossroad(next);
    } else if (currentChapter.next_chapter !== null) {
      next = findObjectById(chapters, currentChapter.next_chapter);
      setCurrentChapter(next);
    } else {
      return;
    }
    setAudio(next.audio);
    addToPath(next);
  }

  //Goes back in story path to prev chapter or crossroad
  function goToPrev() {
    let prevSpot;
    if (storyPath.length == 1) {
      setCurrentChapter(storyPath[0]);
      setCurrentCrossroad(0);
      setAudio(storyPath[0].audio);
    } else {
      let newPath = [...storyPath];
      newPath.pop();
      prevSpot = newPath[newPath.length - 1];
      setStoryPath(newPath);
      if (prevSpot.roads) {
        setCurrentCrossroad(prevSpot);
      } else {
        setCurrentCrossroad(0);
        setCurrentChapter(prevSpot);
      }
      setAudio(prevSpot.audio);
    }
  }

  //collectRoads takes in list of roads id and returns list of roads using findObjectById
  function collectRoads(roadCollection) {
    let roadList = [];
    for (let i = 0; i < roadCollection.length; i++) {
      let road = findObjectById(roads, roadCollection[i]);
      roadList.push(road);
    }
    return roadList;
  }

  return (
    <View style={styles.container}>
      {loading === true ? (
        <ActivityIndicator size={'large'} color={'green'} />
      ) : (
        <>
          {currentCrossroad ? (
            <Crossroad
              crossroad={currentCrossroad}
              roads={collectRoads(currentCrossroad.roads)}
              onClickFunction={setCurrentChapterUsingId}
              goToPrev={goToPrev}
            />
          ) : (
            <View style={styles.container}>
              <Text style={styles.text}>{currentChapter.title}</Text>
              <ImageBackground
                source={{ uri: `${currentChapter.image}` }}
                resizeMode="cover"
                style={styles.image}
              />
              <Player
                url={audio}
                nextClick={goToNext}
                prevClick={goToPrev}
                hasEnded={currentChapter.is_end}
                isStart={currentChapter.is_start}
                chapterDuration={currentChapter.duration}
                bottomSheetIndex={bottomSheetIndex}
                setBottomSheetIndex={setBottomSheetIndex}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 5,
    justifyContent: 'center',
  },
  image: {
    height: metrics.height * 0.8,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  backgroundImage: {
    flex: 1,
  },
  titleContailer: {},
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'snow',
    padding: 10,
    elevation: 5,
    marginTop: 80,
  },
  text: {
    color: 'snow',
    fontSize: 25,
    alignSelf: 'center',
    marginTop: -20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    elevation: 5,
  },
});
