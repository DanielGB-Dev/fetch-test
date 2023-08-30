import React, { useEffect, useState } from "react";
import "../../styles/Search/SearchPage.css";
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  Fab,
  TextField,
  ToggleButton,
} from "@mui/material";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import DogsList from "./DogsList";
import { useNavigate } from "react-router-dom";

const SearchPage: React.FC = () => {
  const [breedsData, setBreedsData] = useState<string[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<number | undefined>();
  const [maxAge, setMaxAge] = useState<number | undefined>();
  const [order, setOrder] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = axios.get<string[]>(
          "https://frontend-take-home-service.fetch.com/dogs/breeds",
          {
            withCredentials: true,
          }
        );
        setBreedsData((await response).data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchBreeds();
  }, []);

  const handleBreedSelection = (
    event: React.SyntheticEvent<Element, Event>,
    selectedBreeds: string[],
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string>
  ) => {
    setFilteredBreeds(selectedBreeds);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="sp-container">
      <h1>Search for a Doggo!</h1>
      <p>
        Search dogs by breed and age range, select your favorites and we'll give
        you a match 🐶
      </p>
      <div className="filters-container">
        <Autocomplete
          multiple
          fullWidth
          id="tags-outlined"
          options={breedsData}
          filterSelectedOptions
          onChange={handleBreedSelection}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Breeds"
              placeholder="Search the breeds you want"
            />
          )}
        />
        <TextField
          id="tf-age-min"
          label="Min Age"
          variant="outlined"
          type="number"
          fullWidth
          onChange={(e) => setMinAge(parseInt(e.target.value))}
        />
        <TextField
          id="tf-age-max"
          label="Max Age"
          variant="outlined"
          type="number"
          fullWidth
          onChange={(e) => setMaxAge(parseInt(e.target.value))}
        />
        <ToggleButton
          value="sort"
          selected={order}
          onChange={() => {
            setOrder(!order);
          }}
        >
          <SortByAlphaIcon />
        </ToggleButton>
      </div>
      <DogsList
        breeds={filteredBreeds}
        minAge={minAge}
        maxAge={maxAge}
        sort={order ? "name:asc" : "name:desc"}
      />
      <div className="log-out-container">
        <Fab
          variant="extended"
          size="medium"
          style={{ backgroundColor: "#ffa900" }}
          onClick={handleLogout}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          Log Out
        </Fab>
      </div>
    </div>
  );
};

export default SearchPage;
