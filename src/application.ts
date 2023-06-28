import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {
  CLUB_SERVICE,
  CRAWL_SERVICE,
  FILE_SERVICE,
  LEAGUE_SEASON_SERVICE,
  LEAGUE_SERVICE,
  MATCH_SERVICE,
  RANKING_SERVICE,
  SEASON_SERVICE,
  STADIUM_SERVICE,
} from './keys';
import {MySequence} from './sequence';
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

export {ApplicationConfig};

export class BasketBallApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Binding
    this.bind(CLUB_SERVICE).toClass(ClubService);
    this.bind(SEASON_SERVICE).toClass(SeasonService);
    this.bind(LEAGUE_SERVICE).toClass(LeagueService);
    this.bind(LEAGUE_SEASON_SERVICE).toClass(LeagueSeasonService);
    this.bind(STADIUM_SERVICE).toClass(StadiumService);
    this.bind(MATCH_SERVICE).toClass(MatchService);
    this.bind(RANKING_SERVICE).toClass(RankingService);
    this.bind(CRAWL_SERVICE).toClass(CrawlDataService);
    this.bind(FILE_SERVICE).toClass(FileService);

    this.component(CronComponent);
  }
}
