import React, { useState } from "react";
import "../../styles/Search/DogCard.css";
import { ToggleButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

type Props = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
  favorite: boolean;
  onToggleFavorite: () => void;
};

const DogCard: React.FC<Props> = ({
  id,
  img,
  name,
  age,
  zip_code,
  breed,
  favorite,
  onToggleFavorite,
}) => {
  return (
    <div className="card-container">
      <img src={img} alt="Doggo" className="dog-img" />
      <div className="name-age-container">
        <h2>{name}</h2>
        <h3>Age: {age}</h3>
      </div>
      <div className="info-container">
        <p>{breed}</p>
        <p>I'm at: {zip_code}</p>
      </div>
      <ToggleButton
        value="favorite"
        style={{ border: "none", marginTop: "8px" }}
        onChange={onToggleFavorite}
      >
        {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </ToggleButton>
    </div>
  );
};

export default DogCard;
