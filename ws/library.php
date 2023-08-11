<?php

function getDatum($den=0){        
    $o = $den < 0 ? "" : "+";
    $date = new DateTime('today '.$o.$den.' days');
    return $date->format('Y-m-d');
}


function sanitize($str){   
    
    if($str == null)
        return "";
    
    return filter_var(trim($str), FILTER_SANITIZE_SPECIAL_CHARS);
}


function strMesic($num=1){
    
    $mesic = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];
    return $mesic[$num-1];
}


function strWeek($week=0){
    
    $w = ["ne","po", "út", "st", "čt", "pá", "so", "ne"];
    return $w[$week];
}


// Function to check string starting
// with given substring
function startsWith ($string, $startString)
{
	$len = strlen($startString);

    $s = strtolower($string);
    $e = strtolower($startString);

	return (substr($s, 0, $len) === $e);
}

function endsWith($string, $endString)
{
	$len = strlen($endString);
	if ($len == 0) {
		return true;
	}

    $s = strtolower($string);
    $e = strtolower($endString);

	return (substr($s, -$len) === $e);
}
