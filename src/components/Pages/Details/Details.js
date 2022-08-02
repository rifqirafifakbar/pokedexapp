import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import LoadingDetails from "../../Atoms/Loading/LoadingDetails";
import Header from "../../Organisms/Header/Header";
import { PokeCard } from "../../Organisms/Poke/PokeCard/PokeCard";
import PokeInfo from "../../Organisms/Poke/PokeInfo/PokeInfo";
import ModalError from "../../Atoms/Others/ModalError";
import api from "../../../services/api";
import axios from "axios";

export const Details = ({ history, ...props }) => {
  const { name } = props.match.params;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [showModalError, setShowModalError] = useState(false);

  useEffect(() => {
    function LoadPokemon() {
      api
        .get(`/pokemon/${name}`)
        .then((response) => {
          if (response.status === 200) {
            LoadSpecies(response.data);
          }
        })
        .catch((error) => {
          setShowModalError(true);
        });
    }

    if (name === undefined) history.push({ pathname: "/" });
    window.scrollTo(0, 0);
    LoadPokemon();
  }, [window.location.pathname]);

  const LoadSpecies = async (poke) => {
    try {
      let pokeSpecies = await api.get(`/pokemon-species/${name}`);
      let pokeEvolution = await axios.get(pokeSpecies.data.evolution_chain.url);

      let flavor_text_sword = "";
      let flavor_text_shield = "";
      let flavor_text_default = "";
      pokeSpecies.data.flavor_text_entries.map((item) => {
        if (item.language.name != "en") return false;
        if (item.version.name == "sword") {
          flavor_text_sword = item.flavor_text;
        } else if (item.version.name == "shield") {
          flavor_text_shield = item.flavor_text;
        }
        flavor_text_default = item.flavor_text;
      });

      let abilities = "";
      poke.abilities.map((item, index) => {
        abilities += `${item.ability.name}${
          poke.abilities.length == index + 1 ? "" : ", "
        }`;
      });

      let obj = {
        id: poke.id,
        name: poke.name,
        types: poke.types,
        flavor_text_sword,
        flavor_text_shield,
        flavor_text_default,
        height: poke.height,
        weight: poke.weight,
        abilities,
        gender_rate: pokeSpecies.data.gender_rate,
        capture_rate: pokeSpecies.data.capture_rate,
        habitat: pokeSpecies.data.habitat?.name,
        stats: poke.stats,
        evolution: pokeEvolution.data.chain,
        image: poke.sprites.versions["generation-v"]["black-white"]
          .animated.front_default,
      };

      setDetails(obj);
      setLoading(false);
    } catch (error) {
      setShowModalError(true);
    }
  }

  return (
    <div>
      <Header />
      <ModalError
        history={history}
        show_modal_error={showModalError}
        msg={"Ops! Could not load the information for this pokemon."}
      />
      <Container fluid className="text-light mb-4">
        {loading ? (
          <LoadingDetails />
        ) : (
          <>
            <Row>
              <Col xs={12} md={12}>
                <PokeCard
                  name={details.name}
                  image={details.image}
                  id={details.id}
                  types={details.types}
                  click={false}
                />
              </Col>

              <Col xs={12} md={12}>
                <PokeInfo
                  height={details.height}
                  capture_rate={details.capture_rate}
                  weight={details.weight}
                  abilities={details.abilities}
                  gender_rate={details.gender_rate}
                  habitat={details.habitat}
                />
              </Col>

            </Row>
          </>
        )}
      </Container>
    </div>
  );
}

