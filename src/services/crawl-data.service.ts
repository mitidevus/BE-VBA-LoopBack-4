import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {
  Club,
  League,
  LeagueSeason,
  Match,
  Ranking,
  Season,
  Stadium,
} from '../models';
import {ClubService} from './club.service';
import {FileService} from './file.service';
import {LeagueSeasonService} from './league-season.service';
import {LeagueService} from './league.service';
import {MatchService} from './match.service';
import {RankingService} from './ranking.service';
import {SeasonService} from './season.service';
import {StadiumService} from './stadium.service';

@injectable({scope: BindingScope.TRANSIENT})
export class CrawlDataService {
  constructor(
    @service(ClubService) public clubService: ClubService,
    @service(LeagueService) public leagueService: LeagueService,
    @service(SeasonService) public seasonService: SeasonService,
    @service(StadiumService) public stadiumService: StadiumService,
    @service(MatchService) public matchService: MatchService,
    @service(RankingService) public rankingService: RankingService,
    @service(LeagueSeasonService)
    public leagueSeasonService: LeagueSeasonService,
    @service(FileService) public fileService: FileService,
  ) {}

  async crawlData(): Promise<number> {
    const folderPath = '../../data';

    const leagues: League[] = await this.leagueService.crawlLeagues();

    const seasons: Season[] = await this.seasonService.crawlSeasons();

    const leagueSeasons: LeagueSeason[] =
      await this.leagueSeasonService.crawlLeagueSeasons();

    const clubs: Club[] = await this.clubService.crawlClubs();

    const stadiums: Stadium[] = await this.stadiumService.crawlStadiums(
      leagueSeasons,
    );

    const matches: Match[] = await this.matchService.crawlMatches(
      leagueSeasons,
    );

    const rankings: Ranking[] = await this.rankingService.crawlRankings(
      leagueSeasons,
    );

    const data = {
      clubs,
      leagues,
      seasons,
      leagueSeasons,
      stadiums,
      matches,
      rankings,
    };

    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp

    await this.fileService.storeToFile(data, folderPath, timestamp);

    return timestamp;
  }
}
