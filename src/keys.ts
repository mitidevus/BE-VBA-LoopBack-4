import {BindingKey} from '@loopback/core';
import {
  ClubService,
  CrawlDataService,
  FileService,
  LeagueSeasonService,
  LeagueService,
  MatchService,
  RankingService,
  SeasonService,
  StadiumService,
} from './services';

export const CLUB_SERVICE = BindingKey.create<ClubService>(
  'services.ClubService',
);

export const LEAGUE_SERVICE = BindingKey.create<LeagueService>(
  'services.LeagueService',
);

export const SEASON_SERVICE = BindingKey.create<SeasonService>(
  'services.SeasonService',
);

export const LEAGUE_SEASON_SERVICE = BindingKey.create<LeagueSeasonService>(
  'services.LeagueSeasonService',
);

export const STADIUM_SERVICE = BindingKey.create<StadiumService>(
  'services.StadiumService',
);

export const MATCH_SERVICE = BindingKey.create<MatchService>(
  'services.MatchService',
);

export const RANKING_SERVICE = BindingKey.create<RankingService>(
  'services.RankingService',
);

export const CRAWL_SERVICE = BindingKey.create<CrawlDataService>(
  'services.CrawlDataService',
);

export const FILE_SERVICE = BindingKey.create<FileService>(
  'services.FileService',
);
