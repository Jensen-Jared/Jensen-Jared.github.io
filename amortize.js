// JavaScript Document
function AmortizeLoan(nStart, nPayment, nRate, nPdRate, iTerm){
    var amortContainer = document.getElementById('amortization-container');
    removeClass(amortContainer,'hide-me');
    var tAmort = document.getElementById('amortize-table');
    tAmort.innerHTML = "";
    
    // if any of the values is 0 or less than zero, do not amortize.  Amortize only positive values.
    if(nStart <= 0 || nPayment <= 0 || nRate <= 0 || nPdRate <= 0){
        return;
    }

    // these are working fields for the amortization schedule
    var nInterest = 0.00;
    var nPrincipal = 0.00;
    var nBalance = nStart;
    var iCounter = 1;

    for (iTerm; iTerm>0; iTerm--){
        // when at final payment, the balance could be less than the payment, so make the last payment the balance
        nInterest = nBalance * nPdRate;
        if((nBalance + nInterest) < nPayment){
            nPayment = nBalance + nInterest;
        }
        nPrincipal = nPayment - nInterest;
        nBalance -= nPrincipal;
        if(nBalance < 0.00){
            nPrincipal += nBalance;
            nBalance = 0.00;
        }
        BuildTable(tAmort, iCounter, 
                   NumberWithCommas(nPayment.toFixed(2)), 
                   NumberWithCommas(nPrincipal.toFixed(2)), 
                   NumberWithCommas(nInterest.toFixed(2)), 
                   NumberWithCommas(nBalance.toFixed(2)));
        iCounter++;
    }
}

// build the amorization table
function BuildTable(tAmortTable, iCounter, nPayment, nPrincipal, nInterest, nBalance){
    var tRow = document.createElement('tr'); // create the table row
    var tData = AddRow(iCounter,iCounter, 1);
    tRow.appendChild(tData);
    tData = AddRow(nPayment,iCounter, 2);
    tRow.appendChild(tData);
    tData = AddRow(nInterest,iCounter, 3);
    tRow.appendChild(tData);
    tData = AddRow(nPrincipal,iCounter, 4);
    tRow.appendChild(tData);
    tData = AddRow(nBalance,iCounter, 5);
    tRow.appendChild(tData);

    tAmortTable.appendChild(tRow);
}

function AddRow(data, iCounter, iCell){
    var tData = document.createElement('td');
    tData.textContent = data;
    tData.id = 'row_' + iCounter + '_cell_' + iCell; // build unique identifier for each cell
    addClass(tData, 'data-row'); // align right
    return tData;
}