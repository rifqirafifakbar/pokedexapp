import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

// components
import Header from "../../Organisms/Header/Header";
import { PokeCard } from "../../Organisms/Poke/PokeCard/PokeCard";
import {Search} from "../../Organisms/search/Search";
import { LoadingCard } from "../../Atoms/Loading/LoadingCard";
import { SavePokemons, VerifyPokemons } from "../../../utils/storage";

// utils
import api from "../../../services/api";
import Colors from "../../../styles/Colors";

export const Home = ({ history, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);
  const [pokemonsTypes, setPokemonsTypes] = useState([]);
  const [select, setSelect] = useState('No filter');
  const { query } = props.match.params;

  let pokemonsOriginal = [];
  const perPage = 16;
  const limit = 48; 
  let max = 0;


  const HandlerResult = (maximum, pokemons) => {
    max = maximum;
    setPokemons(pokemons);
  }

  useEffect(() => {
    setLoading(true);
    let filterPokemons = [];
    if (query === undefined) {
      HandlerResult(
        pokemonsOriginal.length,
        pokemonsOriginal.slice(0, perPage)
      );
      setLoading(false);
      return false;
    }

    // jika dia punya param di url/search, filter disini
    history.push(`/${query}`);
    if(select !== 'No filter'){
      filterPokemons = pokemonsOriginal.filter((item) => {
        return (
          item.name.includes(query.toLowerCase()) && item.typeFilter.includes(select) || item.number.includes(query)
        );
      });
      
    }else {
      filterPokemons = pokemonsOriginal.filter((item) => {
        return (
          item.name.includes(query.toLowerCase()) 
        );
      });
    }

    HandlerResult(filterPokemons.length, filterPokemons.slice(0, perPage));
    setLoading(false);

  }, [query, select]);

  useEffect(() => {
    setLoading(true);
    LoadPokemonsType();
    const listLocal = VerifyPokemons();

    // check localstorage
    if (listLocal == null) {
      LoadPokemons();
      return false;
    }

    // if theres local storage, execute code 
    pokemonsOriginal = listLocal;
    if (query !== undefined) {
      let filterPokemons = listLocal.filter(
        (i) => i.name.includes(query.toLowerCase()) || i.types.includes(query) || i.typeFilter.includes(query)
      );

      HandlerResult(filterPokemons.length, filterPokemons.slice(0, perPage));
    } else {
      HandlerResult(listLocal.length, listLocal.slice(0, perPage));
    }
    setLoading(false);
  }, []);

  const LoadPokemonsType = async () =>{
    let pokeListType = await api.get(`/type`);
    let all = [];

    for (let i = 0; i < pokeListType.data.results.length; i++) {
      let rifqi = pokeListType.data.results[i]

      let obj = {
        name: rifqi.name,
        id: i,
      };

      all.push(obj);
    }

    setPokemonsTypes(all)
  }

  const LoadPokemons = async () =>{
    let pokeList = await api.get(`/pokemon?limit=${limit}`);
    let all = [];
    for (let i = 0; i < pokeList.data.results.length; i++) {
      let pokeDetails = await api.get(
        `/pokemon/${pokeList.data.results[i].name}`
      );

      let obj = {
        name: pokeDetails.data.name,
        id: pokeDetails.data.id,
        types: pokeDetails.data.types,
        typeFilter: pokeDetails.data.types.map((type) => type.type.name).join(', '),
        number: pokeDetails.data.id.toString().padStart(3, "0"),
        image:
          pokeDetails.data.sprites.other["dream_world"].front_default,
      };
      all.push(obj);

    }

    SavePokemons(all);
    pokemonsOriginal = all;
    HandlerResult(all.length, all);
    setLoading(false);
  }

  const LoadMore = () => {
    setTimeout(() => {
      const limit = pokemons.length + perPage;
      if (query === undefined) {
        setPokemons(pokemonsOriginal.slice(0, limit));
      } else {
        let filterPokemons = pokemonsOriginal.filter((item) => {
          return (
            item.name.includes(query.toLowerCase()) ||
            item.number.includes(query)
          );
        });
        setPokemons(filterPokemons.slice(0, limit));
      }
    }, 1000);
  }

  const HandlerSelect = event => {
    setSelect(event.target.value)
  }

  return (
    <div>
      <Header />

      <Container fluid>

        <Row className="align-items-center">
          <Col xs={12} sm={9}>
            <Search history={history} query={query} />
          </Col>

          <Col xs={12} sm={3}>
            {pokemonsTypes.length ? 
              <div>
                <select 
                  value={select} 
                  onChange={HandlerSelect} 
                >
                  <option value='No filter'>No filter</option>
                  {pokemonsTypes.map((item,idx) => (
                    <option value={item.name} key={idx}>{item.name}</option>
                    ))
                  }
                </select>
              </div> :''
            }
          </Col>
        </Row>


        {loading ? (
          <LoadingCard qty={12} />
        ) : (
          <InfiniteScroll
            style={{ overflow: "none" }}
            dataLength={pokemons.length}
            next={LoadMore}
            hasMore={pokemons.length < max}
            loader={
              <div className="mb-4 d-flex justify-content-center align-item-center">
                <Spinner
                  style={{ color: Colors.card_gray }}
                  animation="border"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            }
            endMessage={
              <p className="text-light" style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <Row>
              {pokemons.map((item) => {
                return (
                  <Col key={item.id} xs={12} sm={6} lg={3}>
                    <PokeCard
                      name={item.name}
                      types={item.types}
                      image={item.image}
                      click={true}
                    />
                  </Col>
                );
              })}
            </Row>
          </InfiniteScroll>
        )}
      </Container>
    </div>
  );
}
