import Spinner from "./Spinner";

import styles from "./CountryList.module.css";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../context/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message
        message={"Add your 1st city by clicking on a city on the map!"}
      />
    );

  const countries = cities.reduce((arrAcc, currCity) => {
    // console.log(currCity)
    if (!arrAcc.map((el) => el.country).includes(currCity.country))
      return [
        ...arrAcc,
        {
          country: currCity.country,
          emoji: currCity.emoji,
        },
      ];
    else return arrAcc;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        // console.log(country)
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
