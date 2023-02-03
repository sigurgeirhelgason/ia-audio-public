import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/api';
import { AuthContext } from '../store/auth-context';

const useFetchBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data: response } = await axios.get(`${BASE_URL}book/`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + authCtx.token,
          },
        });
        setBooks(response);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  return {
    books,
    loading,
  };
};

export default useFetchBooks;
