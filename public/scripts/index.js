// will likley need to send information to the back end and qait for a reply
let typingInput;

var cityNames = [];
// 1: wait for user to finish typing
// 2: async/await query api
// 3: populate search box

$("#flightOriginInput").keypress(async function(event){
    clearTimeout(typingInput);
    typingInput = setTimeout(async function(){
        var flightOriginInput = $("#flightOriginInput").val();
        if(flightOriginInput != ''){
            var cities = await search_matching_cities(flightOriginInput);
            var cities_formatted = format_city_names(cities);
            $("#searchResultsOriginDivUL").children().remove();
            $("#searchResultsOriginDivUL").append(cities_formatted);
        }
    }, 500);
   
});

$("#flightDestinationInput").keypress(function(event){
    clearTimeout(typingInput);
    typingInput = setTimeout(async function(){
        var flightDestinationInput = $("#flightDestinationInput").val();
        if(flightDestinationInput != ''){
            var cities = await search_matching_cities(flightDestinationInput);
            var cities_formatted = format_city_names(cities);
            $("#searchResultsDestinationUL").children().remove();
            $("#searchResultsDestinationUL").append(cities_formatted);
        }
        
    }, 500);
});


async function search_matching_cities(city_name){
    const params = new URLSearchParams();
    params.append("name", city_name);

    try{
        const matching_city_names =  await fetch(`/search/cityairports?${params}`);

        if (!matching_city_names.ok) {
            throw new Error(`Response status: ${matching_city_names.status}`);
          }

        const data = await matching_city_names.json();
        return data
    } catch (error){
        console.log(error);
    }
}

function format_city_names(results){
    if (results){
        const content= results.map((item) =>{
            //if item is AIRPORT
            if(item.subType == "AIRPORT"){
                return "<li>" + item.address.cityName + " (" + item.iataCode  + ")" + "</li>"
            }
        });
        return content;
    }
    return "";
}
  