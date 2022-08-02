import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../../Poke/styles.scss";

import pokemon_placeholder from "../../../../assets/img/pokemon-placeholder.png";

export const PokeCard = ({ name, id, types, image, click }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [id]);

  return (
    <Link to={click ? `/details/${name}` : "javascript:void"} className="card-poke">
      <div className="container-card mb-4">
        <div>
          <div className="text-center">
            <h2 className="pokemon-name limit-text my-0">{name}</h2>
          </div>
        </div>
        <figure
          className={`container-card-img position-relative my-4 container-${types[0].type.name}`}
        >
        
            {error ? (
              <img alt={name} title={name} src={pokemon_placeholder} />
            ) : (
              <img
                onError={(e) => setError(true)}
                alt={name}
                title={name}
                src={image}
              />
            )}
          
        </figure>
        <div className="w-100  d-flex justify-content-between">
          {types.map((item, index) => {
            return (
              <div
                key={index}
                className={`${item.type.name} type-item ${types.length === 1 ? "w-100" : ''}`}
              >
                <p className="mb-0 text-uppercase">{item.type.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Link>
  );
};
