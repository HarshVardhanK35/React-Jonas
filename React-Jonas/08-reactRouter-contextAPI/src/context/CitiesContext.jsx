//! before useReducer (used Context -API)

// import { createContext, useState, useEffect, useContext } from "react";

// const BASE_URL = "http://localhost:8080";

// // createContext()
// const CitiesContext = createContext();

// function CitiesProvider({ children }) {
//   const [cities, setCities] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // for current city more details below..
//   const [currentCity, setCurrentCity] = useState({});

//   useEffect(function () {
//     async function fetchCities() {
//       try {
//         setIsLoading(true);
//         const res = await fetch(`${BASE_URL}/cities`);
//         const data = await res.json();

//         setCities(data);
//         //
//       } catch (err) {
//         alert(`Error while fetching data ${err}`);
//         //
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchCities();
//   }, []);

//   async function getCity(id) {
//     try {
//       setIsLoading(true);
//       const res = await fetch(`${BASE_URL}/cities/${id}`);
//       const data = await res.json();

//       setCurrentCity(data);
//       //
//     } catch (err) {
//       alert(`Error while loading data... ${err}`);
//       //
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
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await res.json();

//       setCities((cities) => [...cities, data]);
//       //
//     } catch (err) {
//       alert(`Error while creating city ${err}`);
//       //
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function deleteCity(id) {
//     try {
//       setIsLoading(true);

//       await fetch(`${BASE_URL}/cities/${id}`, {
//         method: "DELETE",
//       });

//       if(!id) throw new Error("error while deleting city!")
//       // we need all cities that are different from current "id" that was passed into it
//       setCities((cities) => cities.filter((city) => city.id !== id));
//       //
//     } catch (err) {
//       alert(`Error while deleting city ${err}`);
//       //
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // Provider property on "CitiesContext"
//   return (
//     <CitiesContext.Provider
//       value={{
//         cities: cities,
//         isLoading: isLoading,
//         currentCity: currentCity,
//         getCity: getCity,
//         createCity: createCity,
//         deleteCity: deleteCity
//       }}
//     >
//       {children}
//     </CitiesContext.Provider>
//   );
// }

// function useCities() {
//   const context = useContext(CitiesContext);
//   if (context === undefined)
//     throw new Error("Cities Context used outside Cities Provider");
//   return context;
// }

// export { CitiesProvider, useCities };

// ! after useReducer()

import { useCallback } from "react";
import { createContext, useEffect, useContext, useReducer } from "react";

const BASE_URL = "http://localhost:8080";

// createContext()
const CitiesContext = createContext();

// useReducer: initial state
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

// useReducer: reducer fn- center for all business logic
function reducer(state, action) {
  switch (action.type) {
    //
    case "loading":
      return {
        ...state,
        isLoading: true,
      };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded": // it is "city" not "cities"
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
        cities: [...state.cities, action.payload],
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        currentCity: {},
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type!");
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({}); // for more details read below comments on this end-of-file

  // useReducer: implementation
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity } = state;

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        // setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
        //
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: `Error while fetching cities ${err}`,
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();

        // setCurrentCity(data);
        dispatch({ type: "city/loaded", payload: data });
        //
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: `Error while loading city ${err}`,
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // setCities((cities) => [...cities, data]);
      dispatch({ type: "city/created", payload: data });
      //
    } catch (err) {
      // alert(`Error while creating city ${err}`);
      dispatch({
        type: "rejected",
        payload: `Error while creating a city ${err}`,
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      if (!id) throw new Error("error while deleting city!");
      // we need all cities that are different from current "id" that was passed into it
      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
      //
    } catch (err) {
      // alert(`Error while deleting city ${err}`);
      dispatch({
        type: "rejected",
        payload: `Error while deleting a city ${err}`,
      });
    }
  }

  // Provider property on "CitiesContext"
  return (
    <CitiesContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
        currentCity: currentCity,
        getCity: getCity,
        createCity: createCity,
        deleteCity: deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities Context used outside Cities Provider");
  return context;
}

export { CitiesProvider, useCities };

/**
 *
 * Current-City
 * ... this has to be a global not a local state
 * ... currentCity has to be used in two components (that's why it is global-state)
 *
 * ... we have to use the same city details.. to set a current city as active
 *
 * -----------------------------------------------------------------------------
 * ! important to understand this...
 *
 * After useReducer Implementation
 * >>> problem:
 * ... "reducers" need to be "Pure Functions"
 *    ... this means we cannot do API requests, inside reducer fn
 *
 * >>> sol:
 * then, we can do fetch requests in separate functions..
 *    ... after data has been received, then we can dispatch actions to the reducer
 *
 * - steps involved:
 * ... while handling this large application with these many states
 *    ... we need to model the action types in "cases- of reducer fn" as not like setters but as "events"
 * ex:
 * not like setters >>> case "setCities":
 *    ... must be as events >>> case "cities/loaded":
 *
 * >>> we have two options while passing value into our context!
 * >>> while working with asynchronous data.. we have two options for dispatching functions
 * #1 pass state + dispatch fn..
 *    ... passing into context's value and we can use dispatch fn inside components (by importing..) to update the state at component's file
 * (as we have asynchronous data.. we cannot have all the clumsy logic inside reducer)
 *
 *    ... so we have complete logic of asynchronous code inside component.jsx file
 * (in order perform this.. we have to pass into dispatch but not into the context.. then only we could write all data fetch logic inside that component)
 *
 * >>> to keep component logic nice and clean
 * ... we follow 2nd option
 * #2 not to pass dispatch fn into context..
 *    ... but instead to use inside event handler fn and then pass them as context's value
 *    (like above code!)
 *
 * $ NOTE:
 * ... but whenever we are not dealing with asynchronous data.. then it would be better to just pass dispatch fns and then create actions right inside components
 *
 *
 *
 * $ UPDATE:
 * ... as soon as a city has been created, make that as currently active city
 *    ... case "city/created": has to be updated!
 *
 * ... and after deleting city, we have to set it to initial state! (city/deleted)
 *
 *
 *
 *
 *
 *
 *
 *
 */
