import axios from "axios";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const omdbApi = axios.create({
  baseURL: import.meta.env.VITE_OMDB_API_PATH,
  params: {
    apikey: API_KEY,
  },
  timeout: 10000
});

export default omdbApi