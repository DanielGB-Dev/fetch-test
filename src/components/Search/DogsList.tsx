import React, { useState, useEffect } from "react";
import "../../styles/Search/DogsList.css";
import axios from "axios";
import DogCard from "./DogCard";
import { Button, CircularProgress, Fab } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

interface FilteredProps {
  breeds?: string[];
  minAge?: number;
  maxAge?: number;
  sort?: string;
}

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const DogsList: React.FC<FilteredProps> = ({
  breeds = [],
  minAge,
  maxAge,
  sort,
}) => {
  const [dogResults, setDogResults] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);

    fetchDogSearchResults(breeds, minAge, maxAge, sort)
      .then((response) => {
        console.log("Dog search results:", response);
        setNextPage(response.next);
        handleFetchDogs(response.resultIds);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [breeds, minAge, maxAge, sort]);

  const fetchDogSearchResults = async (
    breeds: string[],
    ageMin: number | undefined,
    ageMax: number | undefined,
    sort: string | undefined
  ): Promise<any> => {
    try {
      const response = await axios.get<any>(
        "https://frontend-take-home-service.fetch.com/dogs/search",
        {
          params: {
            breeds,
            ageMin,
            ageMax,
            sort,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dog search results:", error);
      throw error;
    }
  };

  const handleFetchDogs = async (resultIds: string[]) => {
    try {
      const response = await axios.post<Dog[]>(
        "https://frontend-take-home-service.fetch.com/dogs",
        resultIds,
        {
          withCredentials: true,
        }
      );
      console.log("Fetched dogs:", response.data);
      setDogResults(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching dogs:", error);
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (nextPage) {
      setIsLoading(true);

      try {
        const response = await axios.get<any>(
          `https://frontend-take-home-service.fetch.com${nextPage}`,
          {
            withCredentials: true,
          }
        );

        setNextPage(response.data.next);
        handleFetchDogs(response.data.resultIds);
      } catch (error) {
        console.error("Error loading more dogs:", error);
      }
    }
  };

  const handleToggleFav = (dogId: string) => {
    if (favoriteDogs.includes(dogId)) {
      setFavoriteDogs((prevLikedDogs) =>
        prevLikedDogs.filter((id) => id !== dogId)
      );
    } else {
      setFavoriteDogs((prevLikedDogs) => [...prevLikedDogs, dogId]);
      console.log(favoriteDogs);
    }
  };

  const navigate = useNavigate();
  const handleSaveFavoriteDogs = async () => {
    console.log(favoriteDogs);
    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        favoriteDogs,
        {
          withCredentials: true,
        }
      );
      console.log("Your match is:", response.data.match);
      navigate(`/matched-dog/${response.data.match}`);
    } catch (error) {
      console.error("Error matching:", error);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="dog-list-container">
        {isLoading ? (
          <CircularProgress style={{ color: "#FFA900" }} />
        ) : (
          <>
            {dogResults.map((dog) => (
              <DogCard
                key={dog.id}
                id={dog.id}
                img={dog.img}
                name={dog.name}
                age={dog.age}
                zip_code={dog.zip_code}
                breed={dog.breed}
                favorite={favoriteDogs.includes(dog.id)}
                onToggleFavorite={() => handleToggleFav(dog.id)}
              />
            ))}
          </>
        )}
      </div>
      <div className="pag-container">
        {nextPage && (
          <div style={{ height: 100 }}>
            <Button
              type="submit"
              disabled={false}
              size="large"
              variant="contained"
              style={{
                margin: "28px",
                backgroundColor: "#DFE0DF",
                color: "#504538",
              }}
              onClick={handleLoadMore}
            >
              Next Page
            </Button>
          </div>
        )}
        {favoriteDogs.length > 0 && (
          <div className="match-btn-container">
            <Fab
              variant="extended"
              style={{ backgroundColor: "#FFA900", color: "#fff" }}
              onClick={handleSaveFavoriteDogs}
            >
              <FavoriteIcon sx={{ mr: 1 }} />
              Get a match
            </Fab>
          </div>
        )}
      </div>
    </div>
  );
};

export default DogsList;
