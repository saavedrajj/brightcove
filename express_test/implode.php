<?php
$values = [
    [
        "5839351931001", "2018-09-24T16:13:54.521Z", "-"
    ],

    [
        "5985235656001", "-", "5985239441001"
    ],
    [
        "5985238470001", "-", "contextAwareEncoding5"
    ],
    [
        "5985238470002", "-", "contextAwareEncoding6"
    ]       
];

			print("<pre>".print_r($values,true)."</pre>");

$contador = count($values)."<br>";
echo $contador."<br>";

$values2 = 8;

foreach ($values as $v1) {
    foreach ($v1 as $v2) {
        echo "\"$v2\",";
    }
}

echo $values2;
?>


