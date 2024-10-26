// /* eslint-disable react/prop-types */
// import { createContext, useContext, useEffect, useState } from "react";

// const BASE_URL = "http://localhost:9000";
// const CitiesContext = createContext();

// export function CitiesProvider({ children }) {
//   const [cities, setCities] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentCity, setCurrentCity] = useState({});

//   useEffect(function () {
//     async function fetchCities() {
//       try {
//         setIsLoading(true);
//         const res = await fetch(`${BASE_URL}/cities`);
//         const citiesData = await res.json();
//         setCities(citiesData);
//       } catch (err) {
//         alert(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchCities();
//   }, []);
//   async function getCurrentCity(id) {
//     try {
//       setIsLoading(true);
//       const res = await fetch(`${BASE_URL}/cities/${id}`);
//       const city = await res.json();
//       setCurrentCity(city);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   async function createCity(newCity) {
//     try {
//       setIsLoading(true);
//       const res = await fetch(`${BASE_URL}/cities`, {
//         method: "POST",
//         body: JSON.stringify(newCity),
//         headers: { "content-type": "application/json" },
//       });
//       const data = await res.json();
//       setCities((cities) => [...cities, data]);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   async function deleteCity(id) {
//     try {
//       setIsLoading(true);
//       const res = await fetch(`${BASE_URL}/cities/${id}`, {
//         method: "DELETE",
//       });
//       setCities((cities) => cities.filter((city) => city.id !== id));
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   return (
//     <CitiesContext.Provider
//       value={{ cities, isLoading, currentCity, getCurrentCity, createCity, deleteCity }}
//     >
//       {children}
//     </CitiesContext.Provider>
//   );
// }

// export function useCities() {
//   const context = useContext(CitiesContext);
//   if (context === undefined)
//     throw new Error("using cities context outside cities provider");
//   return context;
// }
/* eslint-disable react/prop-types */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

const BASE_URL = "http://localhost:9000";
const CitiesContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/added":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("not a valid action type");
  }
}

const initialState = {
  isLoading: false,
  cities: [],
  currentCity: {},
  error: "",
};

export function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const isMounted = useRef(false);

  useEffect(() => {
    // Skip alerting on the first render
    if (isMounted.current && error) {
      alert(error); // Alert when the error state changes after the first render
    } else {
      isMounted.current = true; // Mark component as mounted after the first render
    }
  }, [error]);

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const citiesData = await res.json();
        dispatch({ type: "cities/loaded", payload: citiesData });
      } catch {
        dispatch({
          type: "rejected",
          payload: "error in loading cities from api",
        });
      }
    }
    fetchCities();
  }, []);
  const getCurrentCity= useCallback(async function getCurrentCity(id) {
    dispatch({ type: "loading" });
    if (currentCity.id === Number(id)) return;
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const city = await res.json();
      dispatch({ type: "city/loaded", payload: city });
    } catch {
      dispatch({ type: "rejected", payload: "error in loading city" });
    }
  }, [currentCity.id]) 
  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "city/added", payload: data });
    } catch (err) {
      dispatch({ type: "rejected", payload: "error in adding new city" });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "error in deleting a city" });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCurrentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("using cities context outside cities provider");
  return context;
}
