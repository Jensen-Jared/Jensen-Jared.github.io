// JavaScript Document
function CheckValues (saveFlag){
    
    var arr = [];
    var sID ;
    arr = Array.prototype.slice.call(document.getElementsByClassName("required"));
    var count = 0;
    
    arr.forEach(function(item,index){
        item.value = item.value.replace( /,/g, "" ); // strip any commas
        if(typeof(item.value) === "undefined" || 
           item.value === "" || item.value === " " ||
           item.value == "0" || item.value == "0.00" || item.value == "0.000" || 
           item.value == null){
            count++;
            sID = item.id;
        }
        else{
            item.value = NumberWithCommas(item.value);
        }
    });
    
    if(typeof(saveFlag) === "undefined" || saveFlag === false){
        if(count >1){
            var message = "only one entry can be blank";
            createMessage(message, 3);
            return false;
        }
        else if(count == 0){
            var message = "atleast one entry must be blank";
            createMessage(message, 3);
            return false;
        }

        this.whatToCalculate = sID;
    }
    
    return true;
    
}

function validateInputs() {
    var counter = 0;
    var arr = [];
    arr = Array.prototype.slice.call(document.getElementsByClassName("required"));
    for(var i = 0; i < arr.length; i++){
        arr[i].value = arr[i].value.replace( /,/g, "" )
        arr[i].value = Number(arr[i].value);
        if(isNaN(arr[i].value) || arr[i].value < 0){
            var message = "Please enter a positive number.";
            showHideError(arr[i].id, message);
            counter++;
        }else{
            continue;
        }
    }

    // if no errors, then return true, otherwise, return false.
    if(counter === 0){
        return true;
    }else{
        return false;
    }
}
