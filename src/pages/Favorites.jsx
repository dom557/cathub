import React, { useEffect, useState } from "react";
import axios from "axios";
import { catOptions } from "../options";

export const Favorites = () => {
  const [favorites, setFavorites] = useState(null);
  const [catData, setCatData] = useState([]);

  const fetchData = () => {
    axios
      .get(
        `https://api.thecatapi.com/v1/favourites?sub_id=my-user-1`,
        catOptions
      )
      .then((response) => setFavorites(response.data));
  };

  useEffect(() => {
    fetchData();
    populateArray();
  }, []);

  const populateArray = () => {
    favorites?.map((favorite) => {
      axios
        .get(
          `https://api.thecatapi.com/v1/images/${favorite.image_id}`,
          catOptions
        )
        .then((response) =>
          setCatData((fulldata) => [...fulldata, response.data])
        );
    });
  };

  const downloadImageBySrc = (imageSrc, fileName, catId, fileExtension) => {
    fetch(`https://cors-anywhere.herokuapp.com/${imageSrc}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || `cat-${catId}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading image:", error));
  };

  return (
    <section className="favorite-container">
      <h1 className="favorite-image-title">Favorites</h1>
      <button className="favorites-button" onClick={populateArray}>
        Load favorites
      </button>
      <div className="favorite-image-grid">
        {catData?.slice(0, 1000).map((cat) => (
          <div className="image-button-pair" key={cat.image_id}>
            <div> {cat.image_id}</div>
            <img className="grid-image" src={cat.url} alt={`cat-${cat.image_id}`} />
            <div className="card-button">
              <button
                className="grid-button download"
                onClick={() =>
                  downloadImageBySrc(cat.url, `cat-${cat.image_id}`, cat.image_id, "jpg")
                }
              >
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
