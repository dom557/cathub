import React, { useEffect, useState } from "react";
import { catOptions } from "../options";
import { apiKey } from "../env";
import axios from "axios";


export const Home = () => {
  const [catData, setCatData] = useState(null);
  const [isFavoriteArray, setIsFavoriteArray] = useState([]);

  const fetchData = () => {
    axios
      .get(
        "https://api.thecatapi.com/v1/images/search?format=json&limit=12",
        catOptions
      )
      .then((response) => {
        setCatData(response.data);
        // Initialize isFavoriteArray with false for each image
        setIsFavoriteArray(new Array(response.data.length).fill(false));
      })
      .catch((error) => console.error("error during fetching"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnClick = (e) => {
    e.preventDefault();
    fetchData();
  };

  const onClickAdd = (event, catId, index) => {
    event.preventDefault();

    const catAddFavoriteOptions = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    };
    const data = {
      image_id: catId,
      sub_id: "my-user-1",
    };

    axios
      .post(
        "https://api.thecatapi.com/v1/favourites",
        data,
        catAddFavoriteOptions
      )
      .then((response) => {
        console.log(response);
        // Update only the clicked image's isFavorite state
        setIsFavoriteArray((prev) => {
          const newArray = [...prev];
          newArray[index] = true;
          return newArray;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const downloadImageBySrc = (imageSrc, fileName) => {
    fetch(`https://cors-anywhere.herokuapp.com/${imageSrc}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || `cat-${cat.id}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading image:", error));
  };

  return (
    <section className="main-container">
      <div className="image-grid">
        {catData?.map((cat, index) => (
          <div className="image-button-pair" key={cat.id}>
            <img className="grid-image" src={cat.url} alt={`Cat ${cat.id}`} />
            <div className="card-button">
              <button
                className={`grid-button ${
                  isFavoriteArray[index] ? "favorite" : ""
                }`}
                onClick={(event) => onClickAdd(event, cat.id, index)}
              >
                <span className="material-symbols-outlined">
                  {isFavoriteArray[index] ? "heart_check" : "favorite"}
                </span>
              </button>
              <button
                className="grid-button download"
                onClick={() => downloadImageBySrc(cat.url, `cat-${cat.id}`)}
              >
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="main-container-description">
        <h2 className="main-container-title">Cat Image Generator</h2>
        <div className="main-container-text">
        🐾 Welcome to Cat Hub! Embark on a purr-fect journey filled with adorable cat images.
         Click the button below to unveil a treasure trove of random cat pictures.
          Ready to capture your favorite feline moments? Just tap the "🤍 Favourite" button and watch your personal collection grow.
           Cat Hub is here to whisker you away into a world of joy—one delightful cat click at a time! 🐱✨
        </div>
        <button className="main-container-button" onClick={handleOnClick}>
          Randomize
        </button>
      </div>
    </section>
  );
};
