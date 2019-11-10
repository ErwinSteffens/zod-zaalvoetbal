<?php

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$inputFileName = "../files/2019-2020/Zaalschema 2019-2020 v1.xlsx";
$outputDir = "../app/src/data";

$timeZone = new DateTimeZone("Europe/Amsterdam");

$locationData = json_decode(file_get_contents("input/locations.json"), true);
$clubData = json_decode(file_get_contents("input/clubs.json"), true);

function slugify($text)
{
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    return $text;
}

function parseTeam($team)
{
    global $clubData;
    global $teamData;

    if (!preg_match("/(.+) ([JM]O\d+-\d+)/", $team, $matches)) {
        throw new RuntimeException("Team failed to match regex: {$team}");
    }

    $clubName = $matches[1];
    $mappedClub = $clubData[$clubName];
    if (!$mappedClub) {
        throw new RuntimeException("Failed to find team name for team: {$clubName}");
    }

    $teamName = $matches[2];

    return [
        'id' => slugify($mappedClub['name']) . '_' . slugify($teamName),
        'clubId' => slugify($mappedClub['name']),
        'name' => $teamName
    ];
}

function processGame($homeTeamId, $awayTeamId, $homeScore, $awayScore)
{
    global $teamData;

    if ($homeScore == null || $awayScore == null) {
        return;
    }

    processScore($homeTeamId, $homeScore, $awayScore);
    processScore($awayTeamId, $awayScore, $homeScore);
}

function processScore($teamId, $goalsFor, $goalsAgainst)
{
    global $teamData, $pouleData;

    $poule = $teamData[$teamId]['pouleId'];

    $pouleData[$poule]['teams'][$teamId]['gamesPlayed']++;

    $pouleData[$poule]['teams'][$teamId]['goalsFor'] += $goalsFor;
    $pouleData[$poule]['teams'][$teamId]['goalsAgainst'] += $goalsAgainst;
    $pouleData[$poule]['teams'][$teamId]['goalsDifference'] += $goalsFor - $goalsAgainst;

    if ($goalsFor > $goalsAgainst) {
        $pouleData[$poule]['teams'][$teamId]['points'] += 3;
        $pouleData[$poule]['teams'][$teamId]['gamesWon']++;
    } else if ($goalsFor < $goalsAgainst) {
        $pouleData[$poule]['teams'][$teamId]['gamesLost']++;
    } else {
        $pouleData[$poule]['teams'][$teamId]['points'] += 1;
        $pouleData[$poule]['teams'][$teamId]['gamesDraw']++;
    }
}

$reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader("Xlsx");
$spreadsheet = $reader->load($inputFileName);

$sheets = $spreadsheet->getAllSheets();

$teamData = [];
$pouleData = [];
$gameSheetName = "wedstrijdoverzicht";
foreach ($sheets as $sheet) {
    if ($sheet->getTitle() !== $gameSheetName) {
        $poule = $sheet->getTitle();
        $parts = explode("-", $poule);
        $poule = $parts[0] . " Poule " . $parts[1];
        $pouleId = slugify($poule);

        $pouleTeams = [];

        $rowIndex = 0;
        while (true) {
            $team = $sheet->getCellByColumnAndRow(2, 2 + $rowIndex)->getValue();

            if (empty($team) || $team === "speeldagen") {
                break;
            }

            $data = parseTeam($team);
            $teamId = $data['id'];

            $teamData[$teamId] = array_merge($data, [
                'pouleId' => $pouleId,
            ]);

            $pouleTeams[$teamId] = [
                'teamId' => $teamId,
                'rank' => 0,
                'points' => 0,
                'gamesPlayed' => 0,
                'gamesWon' => 0,
                'gamesLost' => 0,
                'gamesDraw' => 0,
                'goalsFor' => 0,
                'goalsAgainst' => 0,
                'goalsDifference' => 0,
            ];

            $rowIndex++;
        }

        $pouleData[$pouleId] = [
            'id' => $pouleId,
            'name' => $poule,
            'teams' => $pouleTeams
        ];
    }
}

$gameSheet = $spreadsheet->getSheetByName($gameSheetName);

$gameData = [];
$timeRows = 20;
$round = 0;
$row = 1;
while (true) {
    $cell = $gameSheet->getCellByColumnAndRow(1, $row);
    if ($cell->getValue() === "sporthal") {
        $dateValue = $gameSheet->getCellByColumnAndRow(1, $row + 1)->getValue();
        $date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($dateValue);

        $column = 3;
        while (true) {
            $locationValue = $gameSheet->getCellByColumnAndRow($column, $row)->getValue();
            if ($locationValue === null || $locationValue === "Totaal") {
                break;
            }

            $location = $locationData[$locationValue];
            if (!$location) {
                die("Failed to find location for value: {$locationValue}");
            }

            for ($rowIndex = 0; $rowIndex < $timeRows; $rowIndex++) {
                $timeValue = $gameSheet->getCellByColumnAndRow(1, $row + $rowIndex + 2)->getValue();
                $time = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($timeValue);
                
                $timestamp = new DateTime($date->format('Y-m-d') . ' ' . $time->format('H:i:s'), $timeZone);

                $homeTeam = trim($gameSheet->getCellByColumnAndRow($column + 0, $row + $rowIndex + 2)->getValue());
                $awayTeam = trim($gameSheet->getCellByColumnAndRow($column + 1, $row + $rowIndex + 2)->getValue());

                if (!empty($homeTeam) &&
                    !empty($awayTeam) &&
                    $homeTeam != "reserve" &&
                    $homeTeam != "puppies") {

                    $homeScore = trim($gameSheet->getCellByColumnAndRow($column + 2, $row + $rowIndex + 2)->getValue());
                    $awayScore = trim($gameSheet->getCellByColumnAndRow($column + 3, $row + $rowIndex + 2)->getValue());

                    $homeScore = $homeScore == "" ? null : intval($homeScore);
                    $awayScore = $awayScore == "" ? null : intval($awayScore);

                    $homeTeamId = parseTeam($homeTeam)['id'];
                    $awayTeamId = parseTeam($awayTeam)['id'];
                    processGame($homeTeamId, $awayTeamId, $homeScore, $awayScore);

                    $gameData[] = [
                        "round" => $round,
                        "time" => $timestamp->format('c'),
                        "homeTeamId" => $homeTeamId,
                        "homeScore" => $homeScore,
                        "awayTeamId" => $awayTeamId,
                        "awayScore" => $awayScore,
                        "locationId" => slugify($location['venue'])
                    ];
                }
            }

            $column += 5;
        }
    } else {
        break;
    }

    $round++;

    $row += $timeRows + 3;
}

$locations = [];
foreach ($locationData as $locationMapping) {
    $locations[] = array_merge([
        'id' => slugify($locationMapping['venue']),
    ], $locationMapping);
}

$clubs = [];
foreach ($clubData as $club) {
    $clubs[] = array_merge([
        'id' => slugify($club['name']),
    ], $club);
}

$poules = [];
foreach ($pouleData as $pouleId => $poule) {
    $poules[] = [
        'id' => $pouleId,
        'name' => $poule['name'],
        'teams' => array_values($poule['teams']),
    ];
}

$teams = [];
foreach ($teamData as $slug => $team) {
    $teams[] = array_merge([
        'id' => $slug,
    ], $team);
}

$games = [];
foreach ($gameData as $game) {
    $games[] = $game;
}

$count = count($locations);
echo "Found '{$count}' locations." . PHP_EOL;
file_put_contents("$outputDir/location.json", json_encode($locations, JSON_PRETTY_PRINT));

$count = count($clubs);
echo "Found '{$count}' clubs." . PHP_EOL;
file_put_contents("$outputDir/club.json", json_encode($clubs, JSON_PRETTY_PRINT));

$count = count($teams);
echo "Found '{$count}' teams." . PHP_EOL;
file_put_contents("$outputDir/team.json", json_encode($teams, JSON_PRETTY_PRINT));

$count = count($poules);
echo "Found '{$count}' poules." . PHP_EOL;
file_put_contents("$outputDir/poule.json", json_encode($poules, JSON_PRETTY_PRINT));

$count = count($games);
echo "Found '{$count}' games." . PHP_EOL;
file_put_contents("$outputDir/game.json", json_encode($games, JSON_PRETTY_PRINT));
