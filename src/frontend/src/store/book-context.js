import React, { useState, createContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constants/api';

// create react native axios context
export const BookContext = createContext();

// create provider
const BookContextProvider = ({ children }) => {
  const [chapters, setChapters] = useState(null);
  const [crossroads, setCrossroads] = useState(null);
  const [roads, setRoads] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookId, setBookId] = useState(0);

  // fetch books
  const fetchBooks = async () => {
    // get token
    const storedToken = await AsyncStorage.getItem('token');
    console.log('BookID: ', bookId);
    // api endpoints
    let endpoints = [
      `${BASE_URL}book/${bookId}/chapters/`,
      `${BASE_URL}book/${bookId}/crossroads/`,
      `${BASE_URL}book/${bookId}/roads/`,
    ];

    setIsLoading(true);
    await Promise.all(
      endpoints.map((endpoint) =>
        axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + storedToken,
          },
        })
      )
    )
      .then(([{ data: chapters }, { data: crossroads }, { data: roads }]) => {
        setChapters(chapters);
        setCrossroads(crossroads);
        setRoads(roads);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(true);
      });
  };

  useEffect(() => {
    fetchBooks().then(() => {
      setIsLoading(false);
    });
  }, [bookId]);

  // return context
  return (
    <BookContext.Provider value={{ chapters, crossroads, roads, isLoading, bookId, setBookId }}>
      {children}
    </BookContext.Provider>
  );
};

export default BookContextProvider;
