import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:8080";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currCity, setCurrCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        //
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
      //
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrCity(data);
      //
    } catch (err) {
      alert(`Error while fetching data ${err}`);
      //
    } finally {
      setIsLoading(false);
    }
  }

  // console.log(cities)

  return (
    <CitiesContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
        currCity: currCity,
        getCity: getCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities-Context was used outside of Cities-Provider");
  return context;
}

export { CitiesProvider, useCities };
