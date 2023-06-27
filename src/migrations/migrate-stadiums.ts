import fs from 'fs';
import path from 'path';
import {DbDataSource} from '../datasources';
import {StadiumRepository} from '../repositories';

export const migrateStadium = async (
  dataSource: DbDataSource,
  filePath: string,
) => {
  try {
    const stadiumRepository = new StadiumRepository(dataSource);

    const readFilePath = path.join(__dirname, filePath);
    const jsonData = fs.readFileSync(readFilePath, 'utf-8');
    const stadiums = JSON.parse(jsonData).data.stadiums;

    for (const stadium of stadiums) {
      const existingStadium = await stadiumRepository.findOne({
        where: {id: stadium.id},
      });

      if (existingStadium) {
        existingStadium.VBAId = stadium.VBAId;
        existingStadium.name = stadium.name;

        await stadiumRepository.update(existingStadium);
      } else {
        await stadiumRepository.create(stadium);
      }
    }

    console.log('Migrate Stadium complete.');
  } catch (error) {
    console.error('Cannot migrate data:', error);
    process.exit(1);
  }
};
