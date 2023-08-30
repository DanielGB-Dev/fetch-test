import React, { useEffect, useState } from "react";
import DogCard from "./DogCard";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";
import "../../styles/Search/MatchedDog.css";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const MatchedDog: React.FC = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const [dogMatched, setDogMatched] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const dogIdsArray = [dogId];
    axios
      .post<Dog[]>(
        "https://frontend-take-home-service.fetch.com/dogs",
        dogIdsArray,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Matched dog:", response.data);
        setDogMatched(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error matched dog:", error);
      });
  }, [dogId]);

  const handleNavigate = () => {
    navigate("/search");
  };
  return (
    <div className="md-container">
      <h1>Here's your match!</h1>
      <div className="match-container">
        {isLoading ? (
          <CircularProgress style={{ color: "#FFA900" }} />
        ) : (
          <>
            {dogMatched.map((dog) => (
              <DogCard
                key={dog.id}
                id={dog.id}
                img={dog.img}
                name={dog.name}
                age={dog.age}
                zip_code={dog.zip_code}
                breed={dog.breed}
                favorite={true}
                onToggleFavorite={() => {}}
              />
            ))}
          </>
        )}
      </div>
      <Button
        type="submit"
        disabled={false}
        size="large"
        variant="contained"
        style={{
          backgroundColor: "#FFA900",
          marginTop: "16px",
        }}
        onClick={handleNavigate}
      >
        Return
      </Button>
    </div>
  );
};

export default MatchedDog;
