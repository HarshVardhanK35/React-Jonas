import CountryItem from "./countryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first country by clicking on a country on the map" />
    );

  // deriving unique country from cities (as users can visit differ cities in same city)
  const countries = cities.reduce((arr, currCity) => {
    if (!arr.map((el) => el.country).includes(currCity.country))
      return [...arr, { country: currCity.country, emoji: currCity.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country}/>
      ))}
    </ul>
  );
}

export default CountryList;
