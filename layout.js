// JavaScript Document
/// Scenario Loading Screens

// the unique id will be returned from the listerner method
function addScenario( iconURL, name, type, value, apr, uniqueID )
{
    // check to see if the scenario-list exists
    var scenarioListWin = document.getElementById('scenario-list');
    if (!(typeof(scenarioListWin) != 'undefined' && scenarioListWin != null))
    {
        // not exists.
        alert("Selected scenario list cannot be found. (" + winID + ")" );
        return;
    }
    
    /*
        <section class="scenario-item grLtBlu">
            <img src="images/icons/cash.png" >
            <div class="title">Computer Loan</div>
            Other / $3,000.00 / 4.36%
            <div class="btn-panel">
                <button type="button" class="btn btn-danger">Delete</button>
                <button type="button" class="btn btn-primary">Load</button>
            </div>
        </section>
    */

    newScenarioItem = document.createElement("section");
    newScenarioItem.id = uniqueID;
    newScenarioItem.classList.add("scenario-item");
    newScenarioItem.classList.add("grLtBlu");
    
    // add the items to the scenario item
    scenarioImg = document.createElement("img");
    scenarioImg.id = uniqueID + "_img";
    scenarioImg.setAttribute('src', iconURL);//'images/icons/cash.png');
    newScenarioItem.appendChild(scenarioImg);
    
    // add the title
    scenarioTitle = document.createElement("div");
    scenarioTitle.id = uniqueID + "_title";
    scenarioTitle.classList.add('title');
    scenarioTitle.innerHTML = name;
    newScenarioItem.appendChild(scenarioTitle);
    
    // add the details.
    newScenarioItem.innerHTML += type + ' / ' + value + ' / ' + apr;
    newScenarioItem.keyValue = name + '|' + type;
    
    // add button panel
    scenarioButtonPanel = document.createElement("div");
    scenarioButtonPanel.id = uniqueID + "_btn_panel";
    scenarioButtonPanel.classList.add('btn-panel');
    
    // add buttons
        // add the button
        scenarioDeleteButton = document.createElement("button");
        scenarioDeleteButton.id = uniqueID + "_"+ type +"_delete_button";
        scenarioDeleteButton.classList.add('btn');
        scenarioDeleteButton.classList.add('btn-danger');
        scenarioDeleteButton.innerHTML = 'Delete';
        scenarioDeleteButton.setAttribute('type', 'button');
        scenarioDeleteButton.addEventListener("click", removeScenarioByElement, false );
        scenarioButtonPanel.appendChild(scenarioDeleteButton);

        // add the button
        scenarioLoadButton = document.createElement("button");
        scenarioLoadButton.id = uniqueID + "_"+ type +"_load_button";
        scenarioLoadButton.classList.add('btn');
        scenarioLoadButton.classList.add('btn-primary');
        scenarioLoadButton.innerHTML = 'Load';
        scenarioLoadButton.setAttribute('type', 'button');
        scenarioLoadButton.keyValue = name + "|" + type;
        scenarioLoadButton.addEventListener('click', btnScenario);
        scenarioButtonPanel.appendChild(scenarioLoadButton);
    
    newScenarioItem.appendChild(scenarioButtonPanel);

    // add item to the scenario list
    scenarioListWin.appendChild(newScenarioItem);
    
}

// the unique id will be returned from the listerner method
function removeScenarioByID( uniqueID )
{
    var selElement = document.getElementById(uniqueID);
    
    if (!(typeof(selElement) != 'undefined' && selElement != null))
    {
        // not exists.
        alert("The Selected Scenario cannot be found on the page" );
        return;
    }
    
    var arrKey = selElement.keyValue.split("|");
    
    DeleteFirebaseRecs(arrKey[0],arrKey[1]);
    
    
    selElement.remove();

    // send informational message to user that scenario was deleted.
    createMessage(arrKey[0] + " was deleted.", 1)

}

function removeScenarioByElement()
{
    // find the parent scenario-item
    var selElement = this.parentElement;
    
    // find the parent item
    while (!selElement.classList.contains('scenario-item'))
    {
        selElement = selElement.parentElement;
    }
    
    removeScenarioByID(selElement.id);
}


/// Messaging system
// this function will create a system messages at the bottome of the screen. 
// msg:     The message that you would like to show on the message
// type:    The type of message, 1 info, 2 warning, 3 error

function createMessage ( msg, type )
{
    /*
    <div id="msg-area">
        <div class="sys-msg rounded-corners transparent">This is my message</div>        
    </div>
    */
    // find the message area
    msgArea = document.getElementById('msg-area');
    msgCount = parseInt( msgArea.getAttribute('count') ) || 0;
    msgArea.setAttribute( 'count', msgCount++ );
    
    var guidVal = guid();
    
    // this function will create a message on the screen 
    newMessage = document.createElement('div');
    newMessage.id = guidVal;
    newMessage.classList.add('sys-msg');
    newMessage.classList.add('rounded-corners');
    
    if (type == 1)
    {
        newMessage.classList.add('info');
    } 
    else if (type == 2)
    {
        newMessage.classList.add('warning');
    } 
    else if (type == 3)
    {
        newMessage.classList.add('error');
        newMessage.classList.add('man-close');
        closeBtn = document.createElement('div');
        closeBtn.classList.add('closeBtn')
        closeBtn.innerHTML = "X";
        newMessage.appendChild( closeBtn );
    }
    // newMessage.classList.add('transparent');
    // newMessage.classList.add('fade');
    newMessage.innerHTML += msg;
    msgArea.appendChild(newMessage);
    
    // fadeIn
    setTimeout( function () { fadeIn(guidVal); }, 500);    
    
}

function fadeIn ( msgID ) {
    msg = document.getElementById( msgID );
    msg.classList.add( "fade-add" );
    
    if (!msg.classList.contains("man-close"))
    {
        // hide the message after 5 seconds
        setTimeout( function () { autoHideMessage(msgID); }, 5000);
    }
    else 
    {
        // add the close event listener
        msg.addEventListener('click', manCloseMsg);
    }
}
                             
function manCloseMsg ()
{
    autoHideMessage(this.id);
}

function autoHideMessage( msgID )
{
    document.getElementById( msgID ).classList.add( "remove" );    

    // schedule item to be removed.
    setTimeout( function () { removeMessage(msgID); }, 500);
}

function removeMessage ( msgID )
{
    document.getElementById(msgID).remove();

    msgArea = document.getElementById('msg-area');
    msgCount = parseInt( msgArea.getAttribute('count') );
    msgArea.setAttribute( 'count', msgCount-- );
    
}

function showHideError (elemID, errorMsg) {
    try{
        var parElem = document.getElementById(elemID).parentNode;
        if (parElem.classList.contains('error'))
        {
            parElem.classList.remove('error');
        } else {
            // set the message
            var children = parElem.childNodes;

            // alert (children.length);

            for(var i=0; i < children.length; i++)
            {
                if (children[i].nodeType != 3)
                {
                    if (children[i].classList.contains('error'))
                    {
                        children[i].innerHTML = errorMsg;
                    }                
                }
            }

            parElem.classList.add('error');
        }
    }catch(e){
        console.log(e.message);
    }
    
}

function hideAllErrors() {
    // set the message
    var inputGroup = document.getElementsByClassName('input-group');
    var msgGroup = document.getElementById('msg-area');
    // alert (children.length);

    for(var i=0; i < inputGroup.length; i++)
    {
        if (inputGroup[i].classList.contains('error'))
        {
            inputGroup[i].classList.remove('error');
        }
    }
    // add code to remove the system message
    while ( msgGroup.firstChild ) msgGroup.removeChild( msgGroup.firstChild );
}

/// utility functions

/*
function remove(id)
{
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}
*/

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};


/// Test Nav - a collection of elements that are used for testing the methods directly.

function toggleTestingTools () 
{
    testNav = document.getElementById("test-nav");
    if (testNav.classList.contains("show"))
    {
        testNav.classList.remove("show");
    } else {
        testNav.classList.add("show");
    };
};

// Event listeners
//document.getElementById("btn-add-scenario").addEventListener("click", function () { addScenario("images/icons/cash.png", guid() , "Auto", "$3,000.00", "4.65%", guid() ) });
document.getElementById("show-btn").addEventListener("click", function() { toggleTestingTools() });