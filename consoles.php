<?php
header('Content-Type: text/xml');
echo '<?xml version="1.0" encoding = "UTF-8" standalone="yes" ?>';
echo '<response>';
	$console = $_GET['console'];
	$consoleArray = array('SNES', 'Nintendo 64', 'Playstation 3', 'Playstation 2', 'Playstation 1', 'Turbo Duo', 'Wii', 'Wii U', 'PSP', 'PSVita', '3DS', 'Gameboy Advanced');
	if(in_array($console,$consoleArray))
		echo 'Yes! I do own the ' .$console.'!';
	elseif($console=='')
		echo 'Select a console to see if I own one or not.';
	else
		echo 'No, I do not own the ' .$console.', but I wish I did!';
	
echo '</response>';
?>