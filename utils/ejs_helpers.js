function hello(){
    var list_continer = $("#passengerFlightSelectContainer");
    return "hellow"
}

function goodbye(){
    return "goodbye"
}




var passengerNumber = 0;

function add_passenger(){
    const list_continer = document.querySelector("#passengerFlightSelectContainer");
    var passenger = create_passenger("NONE");
    list_continer.append(passenger);
    passengerNumber++;
}


function create_passengers_from_list(all_passengers){
    const list_continer = document.querySelector("#passengerFlightSelectContainer");
    for(var i = 0; i < all_passengers.length; ++i){
        var passenger = create_passenger(all_passengers[i].travelerType);
        list_continer.append(passenger);
        passengerNumber++;
    }
}

function create_passenger(selected_option){

    const passenger_list_item = document.createElement('li');
    passenger_list_item.add('list-group-item');

    const passenger_label = document.createElement('label');
    passenger_label.textContent = 'Passenger';

    const passengerSelectElement = document.createElement('selector');
    passengerSelectElement.add('form-control','form-select');
    passengerSelectElement.setAttribute('name', `passenger_${passengerNumber}`);

    const option_1 = document.createElement('option');
    option_1.textContent = "Seated Infant";
    option_1.value = 'SEATED_INFANT';
    option_1.selected = (selected_option == "SEATED_INFANT") ? true : false;

    const option_2 = document.createElement('option');
    option_2.textContent = "Child";
    option_2.value = 'CHILD';
    option_2.selected = (selected_option == "CHILD") ? true : false;

    const option_3 = document.createElement('option');
    option_3.textContent = "Young";
    option_3.value = 'YOUNG';
    option_3.selected = (selected_option == "YOUNG") ? true : false;

    const option_4 = document.createElement('option');
    option_4.textContent = "Student";
    option_4.value = 'STUDENT';
    option_4.selected = (selected_option == "STUDENT") ? true : false;

    const option_5 = document.createElement('option');
    option_5.textContent = "Adult";
    option_5.value = 'ADULT';
    option_5.selected = (selected_option == "ADULT") ? true : false;

    const option_6 = document.createElement('option');
    option_6.textContent = "Senior";
    option_6.value = 'SENIOR';
    option_6.selected = (selected_option == "SENIOR") ? true : false;

    const option_7 = document.createElement('option');
    option_7.textContent = "Select a Passenger";
    option_7.value = 'NONE';
    option_7.selected = (selected_option == "NONE") ? true : false;
    option_7.hidden = true;

    passengerSelectElement.append(option1, option2, option3, option4, option5, option6, option7);

    const passenger_remove_btn = document.createElement('button');
    passenger_remove_btn.setAttribute('type', 'button');
    passenger_remove_btn.add('form-control', 'btn-outline-secondary');
    passenger_remove_btn.textContent = "Remove Passenger"

    
    passenger_remove_btn.onclick =  function(){
        this.parentElement.remove();
    };

    passenger_list_item.append(passenger_label);
    passenger_list_item.append(passengerSelectElement);
    passenger_list_item.append(passenger_remove_btn);

    return passenger_list_item;

}


export default {
    hello,
} 

