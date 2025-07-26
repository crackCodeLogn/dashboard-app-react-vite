export const readAllLines = async () => {
  return fetch("SimulatorResult.csv")
    .then(response => response.text());
};