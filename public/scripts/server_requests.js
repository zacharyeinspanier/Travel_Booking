export async function fetch_city_airports(city_name) {
    const params = new URLSearchParams();
    params.append("name", city_name);
  
    try {
      const matching_city_names = await fetch(`/search/cityairports?${params}`);
      return matching_city_names;
    } catch (error) {
      console.log(error);
    }
  }