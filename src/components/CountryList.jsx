/* eslint-disable react/prop-types */

import CountryItem from "./CountryItem";
import Message from "./Message";
import styles from "./CountryList.module.css";
import { useCities } from "../Contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return;
  if (!cities.length)
    return (
      <Message message={"Add your first city by clicking on city on map"} />
    );

  const countries = cities.reduce((countryArr, city) => {
    if (!countryArr.map((el) => el.country).includes(city.country)) {
      return [...countryArr, { country: city.country, emoji: city.emoji }];
    } else {
      return countryArr;
    }
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        // eslint-disable-next-line react/jsx-key
        <CountryItem country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
