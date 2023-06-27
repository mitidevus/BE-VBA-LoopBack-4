import fs from 'fs';
import path from 'path';
import {DbDataSource} from '../datasources';
import {
  ClubRepository,
  MatchRepository,
  StadiumRepository,
} from '../repositories';

export const migrateMatch = async (
  dataSource: DbDataSource,
  filePath: string,
) => {
  try {
    const clubRepository = new ClubRepository(dataSource);
    const stadiumRepository = new StadiumRepository(dataSource);
    const matchRepository = new MatchRepository(
      dataSource,
      async () => clubRepository,
      async () => stadiumRepository,
    );

    const readFilePath = path.join(__dirname, filePath);
    const jsonData = fs.readFileSync(readFilePath, 'utf-8');
    const matches = JSON.parse(jsonData).data.matches;

    for (const match of matches) {
      const existingMatch = await matchRepository.findOne({
        where: {id: match.id},
      });

      if (existingMatch) {
        existingMatch.VBAId = match.VBAId;
        existingMatch.homeClubId = match.homeClubId;
        existingMatch.awayClubId = match.awayClubId;
        existingMatch.leagueSeasonId = match.leagueSeasonId;
        existingMatch.stadiumId = match.stadiumId;
        existingMatch.homeScore = match.homeScore;
        existingMatch.awayScore = match.awayScore;
        existingMatch.date = match.date;
        existingMatch.status = match.status;

        await matchRepository.update(existingMatch);
      } else {
        await matchRepository.create(match);
      }
    }

    console.log('Migrate Match complete.');
  } catch (error) {
    console.error('Cannot migrate data:', error);
    process.exit(1);
  }
};
