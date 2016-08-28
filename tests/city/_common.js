let maxResourceDefault = 1000;

function enabledCityPlayer(city, maxResource) {
  if (!maxResource) {
    maxResource = maxResourceDefault;
  }
  let values = {
    name: "Name",
    effects: [
      new EnableResourceEffect({
        type: kResourceGold,
        amount: maxResource
      })
    ]
  };
  if (city) {
    values.city = city;
  }
  return new CityPlayer(values);
};
