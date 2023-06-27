import fs from 'fs';
import path from 'path';
import {DbDataSource} from '../datasources';
import {ClubRepository, RankingRepository} from '../repositories';

export const migrateRanking = async (
  dataSource: DbDataSource,
  filePath: string,
) => {
  try {
    const clubRepository = new ClubRepository(dataSource);
    const rankingRepository = new RankingRepository(
      dataSource,
      async () => clubRepository,
    );

    const readFilePath = path.join(__dirname, filePath);
    const jsonData = fs.readFileSync(readFilePath, 'utf-8');
    const rankings = JSON.parse(jsonData).data.rankings;

    for (const ranking of rankings) {
      const existingRanking = await rankingRepository.findOne({
        where: {id: ranking.id},
      });

      if (existingRanking) {
        existingRanking.clubId = ranking.clubId;
        existingRanking.leagueSeasonId = ranking.leagueSeasonId;
        existingRanking.position = ranking.position;
        existingRanking.gamesPlayed = ranking.gamesPlayed;
        existingRanking.won = ranking.won;
        existingRanking.lost = ranking.lost;
        existingRanking.percentageWon = ranking.percentageWon;
        existingRanking.scoredFor = ranking.scoredFor;
        existingRanking.scoredAgainst = ranking.scoredAgainst;
        existingRanking.pointsDiff = ranking.pointsDiff;
        existingRanking.streak = ranking.streak;

        await rankingRepository.update(existingRanking);
      } else {
        await rankingRepository.create(ranking);
      }
    }

    console.log('Migrate Rankings complete.');
  } catch (error) {
    console.error('Cannot migrate data:', error);
    process.exit(1);
  }
};
