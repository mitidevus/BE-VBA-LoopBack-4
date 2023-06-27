import fs from 'fs';
import path from 'path';
import {DbDataSource} from '../datasources';
import {ClubRepository} from '../repositories';

export const migrateClub = async (
  dataSource: DbDataSource,
  filePath: string,
) => {
  try {
    const clubRepository = new ClubRepository(dataSource);

    const readFilePath = path.join(__dirname, filePath);
    const jsonData = fs.readFileSync(readFilePath, 'utf-8');
    const clubs = JSON.parse(jsonData).data.clubs;

    for (const club of clubs) {
      const existingClub = await clubRepository.findOne({
        where: {id: club.id},
      });

      if (existingClub) {
        existingClub.VBAId = club.VBAId;
        existingClub.name = club.name;
        existingClub.logo = club.logo;
        existingClub.image = club.image;
        existingClub.address = club.address;
        existingClub.website = club.website;
        existingClub.email = club.email;
        existingClub.phone = club.phone;
        existingClub.history = club.history;

        await clubRepository.update(existingClub);
      } else {
        await clubRepository.create(club);
      }
    }

    console.log('Migrate Club complete.');
  } catch (error) {
    console.error('Cannot migrate data:', error);
    process.exit(1);
  }
};
