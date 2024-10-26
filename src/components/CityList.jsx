/* eslint-disable react/prop-types */

import CityItem from "./CityItem";
import Message from "./Message";
import styles from "./CityList.module.css";
import { useCities } from "../Contexts/CitiesContext";
import Spinner from "./Spinner";

function CityList() {
  const {cities,isLoading}=useCities()
  if (isLoading) <Spinner/>;
  if (!cities.length){
    return(
        <Message message={"Add your first city by clicking on city on map"}/>
    )
  }
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  )
}

export default CityList;
