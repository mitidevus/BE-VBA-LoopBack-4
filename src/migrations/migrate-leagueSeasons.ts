import fs from 'fs';
import path from 'path';
import {DbDataSource} from '../datasources';
import {
  LeagueRepository,
  LeagueSeasonRepository,
  SeasonRepository,
} from '../repositories';

export const migrateLeagueSeason = async (
  dataSource: DbDataSource,
  filePath: string,
) => {
  try {
    const leagueRepository = new LeagueRepository(dataSource);
    const seasonRepository = new SeasonRepository(dataSource);
    const leagueSeasonRepository = new LeagueSeasonRepository(
      dataSource,
      async () => leagueRepository,
      async () => seasonRepository,
    );

    const readFilePath = path.join(__dirname, filePath);
    const jsonData = fs.readFileSync(readFilePath, 'utf-8');
    const leagueSeasons = JSON.parse(jsonData).data.leagueSeasons;

    for (const leagueSeason of leagueSeasons) {
      const existingLeagueSeason = await leagueSeasonRepository.findOne({
        where: {id: leagueSeason.id},
      });

      if (existingLeagueSeason) {
        existingLeagueSeason.VBAId = leagueSeason.VBAId;
        existingLeagueSeason.leagueId = leagueSeason.leagueId;
        existingLeagueSeason.seasonId = leagueSeason.seasonId;

        await leagueSeasonRepository.update(existingLeagueSeason);
      } else {
        await leagueSeasonRepository.create(leagueSeason);
      }
    }

    console.log('Migrate League-Season complete.');
  } catch (error) {
    console.error('Cannot migrate data:', error);
    process.exit(1);
  }
};
