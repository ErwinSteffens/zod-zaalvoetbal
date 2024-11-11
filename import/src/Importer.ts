import * as fs from 'fs';
import { Map, Set } from 'immutable';

import { slug } from './utils';
import SheetParser, {
  SheetPoule,
  SheetTeam,
  SheetGame,
  SheetContact,
} from './SheetParser';
import TeamNameParser from './input/TeamName';
import TeamCollection from './input/TeamCollection';
import ClubCollection from './input/ClubCollection';
import LocationCollection from './input/LocationCollection';
import GameCollection, { GameStatus } from './input/GameCollection';
import PouleCollection, { Poule, TeamScore } from './input/PouleCollection';
import ScoreCalculator from './ScoreCalculator';
import ContactCollection, { Contact } from './input/ContactCollection';

class Importer {
  sheetParser: SheetParser;
  contacts: ContactCollection;
  clubs: ClubCollection;
  locations: LocationCollection;
  games: GameCollection;
  poules: PouleCollection;
  teams: TeamCollection;

  constructor(inputFile: string) {
    console.log();
    console.log('Reading input json files...');

    this.contacts = new ContactCollection();
    this.clubs = new ClubCollection('./input/clubs.json');
    this.locations = new LocationCollection('./input/locations.json');
    this.games = new GameCollection();
    this.poules = new PouleCollection();
    this.teams = new TeamCollection();

    this.sheetParser = new SheetParser(inputFile);
    this.sheetParser.contactFound = (contact) => this.contactFound(contact);
    this.sheetParser.pouleFound = (poule) => this.pouleFound(poule);
    this.sheetParser.teamFound = (team) => this.teamFound(team);
    this.sheetParser.teamFoundInPoule = (team) => this.teamFoundInPoule(team);
    this.sheetParser.gameFound = (game) => this.gameFound(game);
  }

  toOutputDir(outputDir: string) {
    console.log();
    console.log('Parsing sheet...');
    console.log();

    this.sheetParser.parse();

    console.log();
    console.log('Executing checks...');

    this.check();

    console.log();
    console.log('Processing games...');

    let scoreCalc = new ScoreCalculator(this.games, this.poules);
    this.poules.items = scoreCalc.processGames();

    for (const club of this.clubs.items) {
      this.contacts.updateClubId(club.name, club.id);
    }

    console.log();
    console.log('Saving results...');

    // Create the output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    this.contacts.save(outputDir);
    this.clubs.save(outputDir);
    this.locations.save(outputDir);
    this.poules.save(outputDir);
    this.teams.save(outputDir);
    this.games.save(outputDir);

    console.log();
    console.log('Done.');
    console.log();
  }

  private contactFound(sheetPoule: SheetContact) {
    let clubId: string | undefined;
    if (sheetPoule.clubName) {
      const club = this.clubs.findByInputName(sheetPoule.clubName);
      clubId = club.id;
    }

    this.contacts.add({
      clubId: clubId,
      name: sheetPoule.name,
      description: sheetPoule.description,
      email: sheetPoule.email,
    } as Contact);
  }

  private pouleFound(sheetPoule: SheetPoule) {
    console.log(`  - Poule found '${sheetPoule.name}'.`);

    this.poules.add({
      id: slug(sheetPoule.name),
      name: sheetPoule.name,
      gamesMultiplier: sheetPoule.gamesMultiplier ?? 1,
      isFinished: false,
      temporary: sheetPoule.temporary,
      teamScores: [],
    });
  }

  private teamFound(teamName: string) {
    const teamInfo = new TeamNameParser(teamName);

    const club = this.clubs.findByInputName(teamInfo.clubName);

    const teamId = slug(`${club.name}-${teamInfo.teamName}`);
    const clubId = slug(club.name);

    this.teams.add({
      id: teamId,
      clubId: clubId,
      name: teamInfo.teamName,
      pouleId: null,
      category: teamInfo.category,
    });
  }

  private teamFoundInPoule(sheetTeam: SheetTeam) {
    console.log(`    - Team added: '${sheetTeam.name}'.`);

    const teamInfo = new TeamNameParser(sheetTeam.name);

    const club = this.clubs.findByInputName(teamInfo.clubName);
    const teamId = slug(`${club.name}-${teamInfo.teamName}`);

    const pouleId = slug(sheetTeam.poule);
    const poule = this.poules.findById(pouleId);

    this.teams.update(teamId, (team) => {
      team.pouleId = pouleId;
    });

    poule.teamScores.push(new TeamScore(teamId));
  }

  private gameFound(game: SheetGame) {
    const location = this.locations.findByInputName(game.location);

    const locationId = slug(location.venue);
    const homeTeamId = this.getTeamId(new TeamNameParser(game.homeTeam));
    const awayTeamId = this.getTeamId(new TeamNameParser(game.awayTeam));

    if (homeTeamId == awayTeamId) {
      console.warn('Same home team id and away team id for game', game);
      throw new Error('Home team id is same as away team id');
    }

    const pouleId = this.poules.getPouleForTeam(homeTeamId).id;

    this.games.add({
      round: game.round,
      time: game.time,
      status: game.status,
      pouleId: pouleId,
      homeTeamId: homeTeamId,
      homeScore: game.homeScore,
      awayTeamId: awayTeamId,
      awayScore: game.awayScore,
      locationId: locationId,
      field: game.field,
    });
  }

  private check() {
    this.teams.items.forEach((team) => {
      if (!team.pouleId) {
        console.warn(`  - WARNING: Team '${team.id}' has no poule`);
      } else {
        let poule = this.poules.findById(team.pouleId);
        let teamsInPoule = poule.teamScores.length;
        let gamesForTeam = this.games.getGamesForTeam(team.id);
        let gamesForTeamExpected = (teamsInPoule - 1) * 2 * poule.gamesMultiplier;

        if (gamesForTeam.length !== gamesForTeamExpected) {
          console.warn(
            `  - WARNING: Expected '${gamesForTeamExpected}' but found '${gamesForTeam.length}' for team '${team.id}' in poule '${team.pouleId}'`,
          );
        }

        let dateVenueMap = Map<string, Set<string>>();
        for (var game of gamesForTeam) {
          var dateStr = game.time.toDateString();

          if (dateVenueMap.has(dateStr)) {
            dateVenueMap = dateVenueMap.update(dateStr, set => set.add(game.locationId));
          }
          else {
            dateVenueMap = dateVenueMap.set(dateStr, Set<string>([game.locationId]));
          }
        }

        dateVenueMap.forEach((venues, dateStr) => {
          if (venues.size > 1) {
            console.warn(`  - WARNING: Multiple venues for team '${team.id}' on date '${dateStr}': '${venues.join(', ')}'`);
          }
        });
      }
    });

    this.teams.items = this.teams.items.filter((t) => !!t.pouleId);

    this.poules.items = this.poules.items.map((poule) => {
      let gamesForPoule = Array.from(this.games.items).filter(
        (game) => game.pouleId == poule.id,
      );
      let isFinished = gamesForPoule.length != 0 && gamesForPoule.every(
        (game) => game.status !== GameStatus.Planned,
      );

      return {
        ...poule,
        ...{
          isFinished: isFinished,
        },
      };
    });
  }

  private getTeamId(info: TeamNameParser): string {
    const clubInfo = this.clubs.findByInputName(info.clubName);
    return slug(`${clubInfo.name}-${info.teamName}`);
  }
}

export default Importer;
