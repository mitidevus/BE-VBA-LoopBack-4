import {BasketBallApplication} from '../application';
import {DbDataSource} from '../datasources';
import {CrawlDataService} from '../services';
import {migrateClub} from './migrate-clubs';
import {migrateLeagueSeason} from './migrate-leagueSeasons';
import {migrateLeague} from './migrate-leagues';
import {migrateMatch} from './migrate-matches';
import {migrateRanking} from './migrate-rankings';
import {migrateSeason} from './migrate-seasons';
import {migrateStadium} from './migrate-stadiums';

export async function migrateDatabase(
  app: BasketBallApplication,
): Promise<void> {
  try {
    const dataSource: DbDataSource =
      app.getSync<DbDataSource>('datasources.db');

    const crawlDataService: CrawlDataService = app.getSync<CrawlDataService>(
      'services.CrawlDataService',
    );

    // const timestamp = await crawlDataService.crawlData();
    const timestamp = 1687505688;
    const filePath = `../../data/${timestamp}.json`;

    await migrateLeague(dataSource, filePath);
    await migrateSeason(dataSource, filePath);
    await migrateLeagueSeason(dataSource, filePath);
    await migrateClub(dataSource, filePath);
    await migrateStadium(dataSource, filePath);
    await migrateMatch(dataSource, filePath);
    await migrateRanking(dataSource, filePath);
  } catch (error) {
    console.error('Cannot migrate data:', error);
    process.exit(1);
  }
}
