// JavaScript Document
var pageCounter = 1;
var animalContainer = document.getElementById("animal-info");
var btn = document.getElementById("btn");

btn.addEventListener("click", function() {
	var myRequest = new XMLHttpRequest();
	myRequest.open('GET', '/info-' + pageCounter + '.json');
	myRequest.onload = function() {
		var myData = JSON.parse(myRequest.responseText);
		renderHTML(myData);
};
myRequest.send();
	pageCounter++;
	if (pageCounter > 3) {
		btn.classList.add("hide-me");
	}
});

function renderHTML(data) {
	var htmlString = "";
	
	for (i = 0; i < data.length; i++) {
		htmlString += "<p>" + data[i].name + " is a " + data[i].species + " that likes to eat ";
		
		for (ii = 0; ii > data[i].foods.likes.length; ii++) {
			if (ii == 0) {
				htmlString += data[i].foods.likes[ii];
			} else {
				htmlString += " and " + data[i].foods.likes[ii];
			}
		}
		
		htmlString += ' and dislikes ';
		
		for (ii = 0; ii > data[i].foods.dislikes.length; ii++) {
			if (ii == 0) {
				htmlString += data[i].foods.dislikes[ii];
			} else {
				htmlString += " and " + data[i].foods.dislikes[ii];
			}
		}
		
		htmlString += '.</p>';
	}
	
	animalContainer.insertAdjacentHTML('beforeend', htmlString);	
}