import * as XLSX from 'xlsx';
import { WorkSheet } from 'xlsx';
import { GameStatus } from './input/GameCollection';

export interface SheetClub {
  clubName: string;
  contactDescription: string;
  contactName: string;
  contactEmail: string;
  managedVenue: string;
}

export interface SheetContact {
  contactDescription: string;
  contactName: string;
  contactEmail: string;
  clubName: string;
}

export interface SheetPoule {
  name: string;
  gamesMultiplier?: number;
  temporary: boolean;
}

export interface SheetTeam {
  name: string;
  poule: string;
}

export interface SheetGame {
  round: number;
  time: Date;
  status: GameStatus;
  location: string;
  field: number | null;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
}

class SheetParser {
  readonly clubsSheetName: string = 'Clubs';
  readonly teamsSheetName: string = 'Teams';
  readonly gameSheetNamePrefix: string = 'Schema';
  readonly timeRows: number = 20;

  workbook: XLSX.WorkBook;
  teamList: Set<string>;

  clubFound: (club: SheetClub) => void;
  contactFound: (club: SheetContact) => void;
  pouleFound: (poule: SheetPoule) => void;
  teamFound: (team: string) => void;
  teamFoundInPoule: (team: SheetTeam) => void;
  gameFound: (game: SheetGame) => void;

  constructor(inputFile: string) {
    this.workbook = XLSX.readFile(inputFile);
  }

  parse() {
    this.log('contacts', () => this.parseContacts());
    this.log('clubs', () => this.parseClubs());
    this.log('teams', () => this.parseTeams());
    this.log('poules', () => this.parsePoules());
    this.log('games', () => this.parseGames());
  }

  private log(itemName: string, handler: () => void) {
    console.log(`Parsing: ${itemName}.`);

    handler();

    console.log('');
  }

  private parseClubs() {
    const sheet = this.workbook.Sheets[this.clubsSheetName];
    let rowIndex = 1;
    while (true) {
      const clubName = this.getCellValue(sheet, 0, rowIndex);
      if (!clubName) {
        break;
      }

      const contactName = this.getCellValue(sheet, 1, rowIndex);
      const contactDescription = this.getCellValue(sheet, 2, rowIndex);
      const contactEmail = this.getCellValue(sheet, 4, rowIndex);
      const managedVenue = this.getCellValue(sheet, 5, rowIndex);

      console.log(`  Club: ${clubName}, contact: ${contactName}, venue: ${managedVenue}.`);

      if (this.teamFound) {
        this.clubFound({
          clubName,
          contactName,
          contactDescription,
          contactEmail,
          managedVenue
        });
      }

      rowIndex++;
    }
  }

  private parseContacts() {
    const sheet = this.workbook.Sheets[this.clubsSheetName];
    let rowIndex = 1;
    while (true) {
      const contactName = this.getCellValue(sheet, 1, rowIndex);
      if (!contactName) {
        break;
      }

      const clubName = this.getCellValue(sheet, 0, rowIndex);
      const contactDescription = this.getCellValue(sheet, 2, rowIndex);
      const contactEmail = this.getCellValue(sheet, 4, rowIndex);

      console.log(`  Contact: ${contactName}, club: ${clubName}, email: ${contactEmail}.`);

      if (this.teamFound) {
        this.contactFound({
          contactName,
          contactDescription,
          contactEmail,
          clubName,
        });
      }

      rowIndex++;
    }
  }

  private parseTeams() {
    const sheet = this.workbook.Sheets[this.teamsSheetName];

    for (let index = 0; index < 200; index++) {
      const teamName = this.getCellValue(sheet, 0, index + 1);
      if (!teamName) {
        continue;
      }

      console.log(`    Team: ${teamName}.`);

      if (this.teamFound) {
        this.teamFound(teamName);
      }
    }
  }

  private parsePoules() {
    this.workbook.SheetNames.forEach((name) => {
      const matches = name.match(/(O\d+)-([A-Z])/);

      if (matches) {
        const sheet: WorkSheet = this.workbook.Sheets[name];

        let pouleName = name;
        if (matches) {
          pouleName = `${matches[1]} Poule ${matches[2]}`;
        }

        const multiplierStr = this.getCellValue(sheet, 3, 0);
        const multiplier = multiplierStr ? parseFloat(multiplierStr) : undefined;
        const temporary = this.getCellValue(sheet, 2, 0) === 'Tijdelijk';

        if (this.pouleFound) {
          this.pouleFound({
            name: pouleName,
            gamesMultiplier: multiplier,
            temporary: temporary,
          });
        }

        let rowIndex = 0;
        while (true) {
          const value = this.getCellValue(sheet, 1, 1 + rowIndex);
          if (!value || value === 'speeldagen') {
            break;
          }

          if (this.teamFoundInPoule) {
            this.teamFoundInPoule({
              name: value,
              poule: pouleName,
            });
          }

          rowIndex++;
        }
      }
    });
  }

  private parseGames() {
    this.workbook.SheetNames.forEach((name) => {
      if (name.startsWith(this.gameSheetNamePrefix)) {

        console.log()
        console.log(`    Sheet '${name}'`)

        const gameSheet = this.workbook.Sheets[name];

        let round = 0;
        let row = 0;
        for (let i = 0; i < 1000; i++) {
          const cell = gameSheet[XLSX.utils.encode_cell({ c: 0, r: row })];
          if (cell && cell.v === 'Sporthal') {
            this.parseGamesForDateRow(gameSheet, row, round);

            round++;
          }

          row++;
        }
      }
    });
  }

  private parseGamesForDateRow(gameSheet: XLSX.Sheet, row: number, round: number) {
    const dateCell =
      gameSheet[XLSX.utils.encode_cell({ c: 0, r: row + 1 })];
    const dateCode = XLSX.SSF.parse_date_code(dateCell.v);

    const date = new Date(
      dateCode.y,
      dateCode.m - 1,
      dateCode.d,
      0,
      0,
    );

    console.log()
    console.log(`      Date: ${date.toDateString()}`)

    let column = 2;
    while (true) {
      let location = this.getCellValue(gameSheet, column, row);
      if (!location || location === 'Totaal') {
        break;
      }

      console.log()
      console.log(`        Location: '${location}'.`);
      console.log()

      let field: number | null = null;
      let fieldMatch = location.match(/([\w- ]+)(?: \(Veld (\d+)\))?$/);
      if (fieldMatch) {
        location = fieldMatch[1];
        field = parseInt(fieldMatch[2]);
      }

      let rowIndex = 0;
      while (true) {
        const timeValue = this.getCellValue(
          gameSheet,
          0,
          row + rowIndex + 2,
        );
        if (!timeValue) {
          break;
        }

        const timeCode = XLSX.SSF.parse_date_code(timeValue);

        const time = new Date(
          dateCode.y,
          dateCode.m - 1,
          dateCode.d,
          timeCode.H,
          timeCode.M,
        );

        const homeTeam = this.getCellValue(
          gameSheet,
          column + 0,
          row + rowIndex + 2,
        );
        const awayTeam = this.getCellValue(
          gameSheet,
          column + 1,
          row + rowIndex + 2,
        );

        if (homeTeam && awayTeam) {
          let status: GameStatus = GameStatus.Planned;

          let homeScore = this.getCellValue(
            gameSheet,
            column + 2,
            row + rowIndex + 2,
          );
          let awayScore = this.getCellValue(
            gameSheet,
            column + 3,
            row + rowIndex + 2,
          );

          if (homeScore !== null || awayScore !== null) {
            if (homeScore === '-' || awayScore === '-') {
              homeScore = 0;
              awayScore = 0;
              status = GameStatus.Cancelled;
            } else if (homeScore === 'x' && awayScore === 'x') {
              homeScore = 0;
              awayScore = 0;
              status = GameStatus.BothTeamNoShow;
            } else if (homeScore === 'x') {
              homeScore = 0;
              awayScore = 3;
              status = GameStatus.HomeTeamNoShow;
            } else if (awayScore === 'x') {
              homeScore = 3;
              awayScore = 0;
              status = GameStatus.AwayTeamNoShow;
            } else {
              status = GameStatus.Played;
            }
          }

          console.log(`          Game: ${time.getHours()}:${this.pad(time.getMinutes(), 2)} ${homeTeam} - ${awayTeam}`)

          if (this.gameFound) {
            this.gameFound({
              round: round,
              time: time,
              status: status,
              location: location,
              field: field,
              homeTeam: homeTeam,
              awayTeam: awayTeam,
              homeScore: homeScore,
              awayScore: awayScore,
            });
          }
        }

        rowIndex++;
      }

      column += 5;
    }
  }

  private pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }

  private getCellValue(sheet: XLSX.WorkSheet, column: number, row: number) {
    const cell = sheet[XLSX.utils.encode_cell({ c: column, r: row })];
    if (!cell) {
      return null;
    }
    return cell.v;
  }
}

export default SheetParser;
