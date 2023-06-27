import fs from 'fs';
import path from 'path';
import {DbDataSource} from '../datasources';
import {SeasonRepository} from '../repositories';

export const migrateSeason = async (
  dataSource: DbDataSource,
  filePath: string,
) => {
  try {
    const seasonRepository = new SeasonRepository(dataSource);

    const readFilePath = path.join(__dirname, filePath);
    const jsonData = fs.readFileSync(readFilePath, 'utf-8');
    const seasons = JSON.parse(jsonData).data.seasons;

    for (const season of seasons) {
      const existingSeason = await seasonRepository.findOne({
        where: {id: season.id},
      });

      if (existingSeason) {
        existingSeason.name = season.name;

        await seasonRepository.update(existingSeason);
      } else {
        await seasonRepository.create(season);
      }
    }

    console.log('Migrate Seasons complete.');
  } catch (error) {
    console.error('Cannot migrate data:', error);
    process.exit(1);
  }
};
