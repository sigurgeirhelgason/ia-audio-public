import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Entypo } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

export default function Player({
  url,
  nextClick,
  prevClick,
  hasEnded,
  isStart,
  chapterDuration,
  bottomSheetIndex,
  setBottomSheetIndex,
}) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [duration, setDuration] = useState(0);
  const [value, setValue] = useState(0);
  const sound = useRef(new Audio.Sound());

  // BottomSheet
  // ref
  const bottomSheetRef = useRef(null);

  // points to snap on screen
  const iosSnapPoints = useMemo(() => ['12%', '22%'], []);
  const androidSnapPoints = useMemo(() => ['9%', '19%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    setBottomSheetIndex(index);
  }, []);

  useEffect(() => {
    loadAudio();
    return () => {
      unloadAudio();
    };
  }, [url, trigger]);

  // Load audio for playback
  const loadAudio = async () => {
    setLoading(true);
    await Audio.setAudioModeAsync({
      staysActiveInBackground: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
    });
    const checkLoading = await sound.current.getStatusAsync();
    if (checkLoading.isLoaded === false) {
      try {
        const result = await sound.current.loadAsync(
          {
            uri: url,
          },
          { shouldPlay: true },
          true
        );
        if (result.isLoaded === false) {
          setLoading(false);
          setLoaded(false);
          console.log('Error in loading Audio');
        } else {
          sound.current.setOnPlaybackStatusUpdate(updateStatus);
          setPlaying(true);
          setLoading(false);
          setLoaded(true);
          setDuration(chapterDuration);
        }
      } catch (error) {
        console.log('catch:', error);
        setLoading(false);
        setLoaded(false);
      }
    } else {
      setLoading(false);
      setLoaded(true);
    }
  };

  const unloadAudio = async () => {
    await sound.current.unloadAsync();
  };

  const playAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === false) {
          sound.current.playAsync();
          setPlaying(true);
        }
      }
    } catch (error) {
      console.log(error);
      setPlaying(false);
    }
  };

  const pauseAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          sound.current.pauseAsync();
          setPlaying(false);
        }
      }
    } catch (error) {
      console.log(error);
      setPlaying(true);
    }
  };

  const resetPlayer = async () => {
    try {
      const checkLoading = await sound.current.getStatusAsync();
      if (checkLoading.isLoaded === true) {
        setValue(0);
        setPlaying(false);
        await sound.current.setPositionAsync(0);
        await sound.current.stopAsync();
      }
    } catch (error) {
      console.log('resetPlayer:', error);
    }
  };

  const updateStatus = async (data) => {
    try {
      if (data.didJustFinish) {
        goToNextChapter();
        if (loaded) {
        }
      } else if (data.positionMillis) {
        if (chapterDuration) {
          setValue((data.positionMillis / chapterDuration) * 100);
        }
      }
    } catch (error) {
      console.log('updateStatus', error);
    }
  };

  const seekUpdate = async (data) => {
    try {
      const checkLoading = await sound.current.getStatusAsync();
      if (checkLoading.isLoaded === true) {
        const result = (data / 100) * duration;
        await sound.current.setPositionAsync(Math.round(result));
      }
    } catch (error) {
      console.log('seekUpdate: ', error);
    }
  };

  const getDurationFormat = (durationInMillis) => {
    let time = durationInMillis / 1000;
    let minutes = Math.floor(time / 60);
    let timeForSeconds = time - minutes * 60;
    let seconds = Math.floor(timeForSeconds);
    let secondsReadable = seconds > 9 ? seconds : `0${seconds}`;
    let totalTime = duration / 1000;
    let totalMinutes = Math.floor(totalTime / 60);
    let totalTimeForSeconds = totalTime - totalMinutes * 60;
    let totalSeconds = Math.floor(totalTimeForSeconds);
    let totalReadableSeconds = totalSeconds > 9 ? totalSeconds : `0${totalSeconds}`;
    return `${minutes}:${secondsReadable} / ${totalMinutes}:${totalReadableSeconds}`;
  };

  // Seek x seconds forward...
  const seekForward = async () => {
    seekUpdate(Math.floor(value) + 10);
  };
  // Seek x seconds backwards...
  const seekBackward = async () => {
    seekUpdate(Math.floor(value) - 10);
  };

  // Næsti kafli
  const goToNextChapter = () => {
    nextClick();
    unloadAudio();
  };

  // Síðasti kafli
  const goToPrevChapter = () => {
    prevClick();
    unloadAudio();
  };

  const reaload = () => {
    setTrigger(!trigger);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={bottomSheetIndex}
      snapPoints={Platform.OS === 'ios' ? iosSnapPoints : androidSnapPoints}
      onChange={handleSheetChanges}
      enableOverDrag={false}
      animateOnMount={true}
      backgroundStyle={styles.bootomSheetBackground}
      handleStyle={styles.bootomSheetHandle}
      handleIndicatorStyle={styles.bootomSheetHandleIndicator}
    >
      <View style={styles.contentContainer}>
        <Slider
          style={{ width: '70%' }}
          minimumValue={1}
          maximumValue={100}
          value={value}
          onSlidingComplete={(data) => seekUpdate(data)}
          minimumTrackTintColor={'snow'}
          maximumTrackTintColor={'black'}
        />
        <View style={styles.controlsContainer}>
          <View style={styles.backwardButtons}>
            {!isStart ? (
              <Entypo
                name="controller-jump-to-start"
                size={40}
                color="#eee"
                onPress={() => goToPrevChapter()}
              />
            ) : (
              <Entypo name="controller-jump-to-start" size={40} color="#666666" />
            )}
          </View>
          <View style={styles.playButtons}>
            <Entypo
              name={playing ? 'controller-paus' : 'controller-play'}
              size={40}
              color="#eee"
              onPress={playing ? () => pauseAudio() : () => playAudio()}
            />
          </View>
          <View style={styles.forwardButtons}>
            {!hasEnded ? (
              <Entypo
                name="controller-next"
                size={40}
                color="#eee"
                onPress={() => goToNextChapter()}
              />
            ) : (
              <Entypo name="controller-next" size={40} color="#666666" />
            )}
          </View>
        </View>
        <Text style={styles.footerText}>{getDurationFormat((value * duration) / 100)}</Text>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  AudioPLayer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
  sheetContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
  },
  footerContainer: {
    padding: 25,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#80f',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
    fontSize: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 33,
    paddingBottom: 5,
  },
  playButtons: {
    flex: 1,
    alignItems: 'center',
    color: 'white',
  },
  forwardButtons: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 100,
  },
  backwardButtons: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 100,
  },
  bootomSheetBackground: {
    backgroundColor: '#333435',
  },
  bootomSheetHandle: {
    backgroundColor: '#696969',
  },
  bootomSheetHandleIndicator: {
    backgroundColor: '#c7c7c7',
  },
});
