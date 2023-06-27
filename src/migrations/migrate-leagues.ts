import fs from 'fs';
import path from 'path';
import {DbDataSource} from '../datasources';
import {LeagueRepository} from '../repositories';

export const migrateLeague = async (
  dataSource: DbDataSource,
  filePath: string,
) => {
  try {
    const leagueRepository = new LeagueRepository(dataSource);

    const readFilePath = path.join(__dirname, filePath);
    const jsonData = fs.readFileSync(readFilePath, 'utf-8');
    const leagues = JSON.parse(jsonData).data.leagues;

    for (const league of leagues) {
      const existingLeague = await leagueRepository.findOne({
        where: {id: league.id},
      });

      if (existingLeague) {
        existingLeague.name = league.name;
        existingLeague.type = league.type;

        await leagueRepository.update(existingLeague);
      } else {
        await leagueRepository.create(league);
      }
    }

    console.log('Migrate League complete.');
  } catch (error) {
    console.error('Cannot migrate data:', error);
    process.exit(1);
  }
};
