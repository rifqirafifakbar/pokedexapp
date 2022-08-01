//Add
export const SavePokemons = (list) => {
  return localStorage.setItem("pokedex_pokemons", JSON.stringify(list));
}

//----------------------------------------------

// Verify
export const VerifyPokemons = () => {
  let pokemons = localStorage.getItem("pokedex_pokemons");
  return JSON.parse(pokemons);
}
