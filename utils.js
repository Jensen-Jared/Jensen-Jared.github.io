// JavaScript Document
function NumberWithCommas(x) {
    var parts = x.toString().split("."); // split the number on the decimal
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // insert the commas
    return parts.join("."); // reassemble the number on the decimal
}

function ValidateEmail(mail){
    
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
    {  
        return true; 
    }
    return false;
} 

function addClass(el, name){
    // remove all instances of the class first
    removeClass(el,name);

    // now add the class
    el.classList.add(name);
}

function removeClass(el, name)
{
    // remove all instances of the class 
    while(el.classList.contains(name)){
       el.classList.remove(name);
    }
}

function GetUserID (){
    try{
        return localStorage.getItem('nerdherdcalc-userid');
    }catch(e){
        console.log(e.message);
        return null;
    }
};

var saveScenario = function (event) {
    try{
        event.preventDefault();
        // remomve all errors before trying to save.  Save will trigger errors as needed.
        
        hideAllErrors();
        
        // perform validations on save
        
        if(validateInputs() && CheckValues(true)){

            var sScenarioName = document.getElementById("scenario-name");

            var sUserID = GetUserID();

            // if no previous user id, then prompt for it and store it as applicable.
            if(typeof(sUserID) === "undefined" || sUserID === null || 
                typeof(sUserID.value) === "undefined" || sUserID.value === null || sUserID.value === ""){

                // loop until either cancel or a valid value is keyed in.
                while(!ValidateEmail(sUserID)){
                    sUserID = prompt("Enter valid email address","");

                    // if cancel button on prompt was clicked, null is returned.
                    if(sUserID === null){
                        return;
                    }
                    else{
                        // else, validate the value to email address.
                        if(ValidateEmail(sUserID)){
                            // save User ID to persistent local storage
                            localStorage.setItem('nerdherdcalc-userid', sUserID);
                            break;

                        }
                    }
                }
            }

            if(typeof(sScenarioName.value) === "undefined" || 
               sScenarioName.value === null || 
               sScenarioName.value === "" || sScenarioName === " "){
                showHideError(sScenarioName.id,"Enter a Scenario Name.");
                return;
            }
            // attempt to add the records to firebase

            if(!addRecords()){
                return false; // add failed, so just return here.
            }

            // send informational message to user that scenario was saved.
            createMessage(sScenarioName.value + " was saved.", 1);
            
            

        ShowAmortizationButton();
        }
    }catch(e){
        console.log(e.message);
    }
    return;
};

function LoadScenario(key){
    try{
        var data = JSON.parse(window.sessionStorage.getItem(key));
        
        // get the key from the button key (parameter passed in)
        var arrMyArr = key.split("|");

        document.getElementById("scenario-name").value = arrMyArr[0]; // scenario name
        document.getElementById("loan-type").value = arrMyArr[1]; // car, home, other
        document.getElementById("rate").value = NumberWithCommas(parseFloat(data.rate).toFixed(3));
        document.getElementById("principal").value = NumberWithCommas(parseFloat(data.principal).toFixed(2));
        document.getElementById("periods").value = parseInt(data.term);
        document.getElementById("period-type").value = data.periodtype; // month, quarter, year
        document.getElementById("payment").value = NumberWithCommas(parseFloat(data.payment).toFixed(2)); 
        document.getElementById("total").value = NumberWithCommas(parseFloat(data.total).toFixed(2));
        document.getElementById("interest-total").value = NumberWithCommas(parseFloat(data.totalinterest).toFixed(2));
        
        ShowAmortizationButton();

        // send informational message to user that scenario was deleted.
        createMessage(arrMyArr[0] + " is loaded.", 1);
    
    }catch(e){
        console.log(e.message);
    }
}


var delRecords = function(event){
    event.preventDefault();
    // extract the scenario name and loan type from the form
    var sScenarioName = document.getElementById("scenario-name").value;
    var sLoanType = document.getElementById("loan-type").value;

    // delete the records from firebase
    if(DeleteFirebaseRecs(sScenarioName, sLoanType)){
        // send informational message to user that scenario was deleted.
        createMessage(sScenarioName + " was deleted.", 1)
    }

    
};


var btnScenario = function(event) {
    try{
        
        // click the close button on the scenario list
        
        document.getElementById("close-modal").click();

        // get the button key 
        var key = event.target.keyValue;

        LoadScenario(key);
    }catch(e){
        console.log(e.message);
    }
};


var newScenario = function(event){
    // clear the input values and get ready for new scenario
    event.preventDefault();
    hideAllErrors();
    var arr = Array.prototype.slice.call(document.getElementsByTagName("input"));
    
    arr.forEach(function (item){
        item.value="";
    });
    
    
    document.getElementById("loan-type").value = "car"; // car, home, other
    document.getElementById("period-type").value = "mo"; // month, quarter, year
    
    addClass(document.getElementById("amortButton"), "hide-me");

};


 var btnGo = function(event){
     event.preventDefault();
     hideAllErrors();
    if(CheckValues() && validateInputs()){
        Calculate();
        ShowAmortizationButton();
    }
     
 };

function ShowAmortizationButton(){
    if(document.getElementById('principal').value != undefined    && document.getElementById('principal').value > "0.00" &&
            document.getElementById('payment').value != undefined && document.getElementById('payment').value >"0.00"    &&
            document.getElementById('rate').value != undefined    && document.getElementById('rate').value > "0.000"      &&
            document.getElementById('periods').value != undefined && document.getElementById('periods').value > "0"){

        document.getElementById('loan-amt').textContent = document.getElementById('principal').value;
        removeClass(document.getElementById("amortButton"), "hide-me");
    }
    
}

var btnAmortize = function (event){
    var principal = document.getElementById('principal').value;
    principal = principal.replace( /,/g, "" );
    principal = parseFloat(principal);
    var payment = document.getElementById('payment').value;
    payment = payment.replace( /,/g, "" );
    payment = parseFloat(payment);
    var rate = document.getElementById('rate').value;
    rate = rate.replace( /,/g, "" );
    rate = parseFloat(rate);
    var pdRate = (rate * .01)/getPeriodsPerYear();
    var iTerm = document.getElementById("periods").value.replace( /,/g, "" );
    
    // requires the values to work amortization
    if(principal>0 && payment > 0 && rate > 0 && pdRate > 0 && iTerm > 0){
        AmortizeLoan(principal, payment, rate, pdRate, iTerm);
    }else{
        // send warning message to user that scenario was deleted.
        createMessage("Insufficient data for amortization.  Button is removed.", 2);
        addClass(document.getElementById("amortButton"), "hide-me");
    }
    
    document.getElementById("loan-amt").textContent=document.getElementById('principal').value;
};

var btnAmortCancel = function (event){
    event.preventDefault();
    addClass(document.getElementById('amortization-container'),'hide-me');
    document.getElementById('amortize-table').innerHTML = "";
};

function numberPad(item){
    // make the input type a number so trigger the number pad on mobile device
    if (item.value === "" ||  item.value === " "){
        item.value = "";
    }else{

        if(item.id === 'term'){
            item.value = parseInt(item.value.replace( /,/g, "" ));
        }else{
            item.value = parseFloat(item.value.replace( /,/g, "" ));
        }
    }
    
    item.setAttribute("type", "number");
}

function makeText(item){
    
    // make the input a text type so it can be formatted as needed.
    item.setAttribute("type", "text");
    if (item.value === "" ||  item.value === " "){
        item.value = "";
    }else{

        // configure the input for proper display
        item.value.replace( /,/g, "" ); // strip commas first -- might have been user input
        if(item.id === 'rate')
            item.value = NumberWithCommas(parseFloat(item.value).toFixed(3));
        else if (item.id !== 'periods')
            item.value = NumberWithCommas(parseFloat(item.value).toFixed(2));
        else
            item.value = parseInt(item.value);
    }

}

function reFormat(data){
    
        document.getElementById("principal").value = NumberWithCommas(parseFloat(data.principal).toFixed(2));
        document.getElementById("payment").value = NumberWithCommas(parseFloat(data.payment).toFixed(2));
        document.getElementById("rate").value = NumberWithCommas(parseFloat(data.rate).toFixed(3));
        document.getElementById("periods").value = NumberWithCommas(parseInt(data.term));
        
        document.getElementById("total").value=NumberWithCommas(parseFloat(data.total).toFixed(2));
        document.getElementById("interest-total").value=NumberWithCommas(parseFloat(data.totalinterest).toFixed(2));

}


function focus(){
    // loop through all number fields and attach an onfocus and onblur event
    var arr = Array.prototype.slice.call(document.getElementsByClassName("number"));

    arr.forEach(function (item) {
        item.setAttribute('onfocus', "numberPad(this)");
        item.setAttribute('onblur', "makeText(this)");
    });
}

var init = function(event){
    document.getElementById("saveButton").addEventListener('click', saveScenario);
    document.getElementById("deleteButton").addEventListener('click', delRecords);
    document.getElementById("open-load-screen").addEventListener('click', getAllRecords);

    document.getElementById("newButton").addEventListener('click', newScenario);
    document.getElementById("goButton").addEventListener('click', btnGo);

    document.getElementById("amortButton").addEventListener('click', btnAmortize);
    document.getElementById("amort-cancel").addEventListener('click', btnAmortCancel);
    
    focus();
}

document.addEventListener("DOMContentLoaded",init);