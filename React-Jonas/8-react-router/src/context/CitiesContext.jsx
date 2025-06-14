import { createContext, useState, useEffect, useContext } from "react";

const BASE_URL = "http://localhost:8080";

// createContext()
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // for current city more details below..
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        setCities(data);
        //
      } catch (err) {
        alert(`Error while fetching data ${err}`);
        //
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      setCurrentCity(data);
      //
    } catch (err) {
      alert(`Error while fetching data ${err}`);
      //
    } finally {
      setIsLoading(false);
    }
  }

  // Provider property on "CitiesContext"
  return (
    <CitiesContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
        getCity: getCity,
        currentCity: currentCity,
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
 *
 *
 *
 */
