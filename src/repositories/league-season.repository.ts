import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LeagueSeason, LeagueSeasonRelations, League, Season} from '../models';
import {LeagueRepository} from './league.repository';
import {SeasonRepository} from './season.repository';

export class LeagueSeasonRepository extends DefaultCrudRepository<
  LeagueSeason,
  typeof LeagueSeason.prototype.id,
  LeagueSeasonRelations
> {

  public readonly league: BelongsToAccessor<League, typeof LeagueSeason.prototype.id>;

  public readonly season: BelongsToAccessor<Season, typeof LeagueSeason.prototype.id>;

  constructor(@inject('datasources.db') dataSource: DbDataSource, @repository.getter('LeagueRepository') protected leagueRepositoryGetter: Getter<LeagueRepository>, @repository.getter('SeasonRepository') protected seasonRepositoryGetter: Getter<SeasonRepository>,) {
    super(LeagueSeason, dataSource);
    this.season = this.createBelongsToAccessorFor('season', seasonRepositoryGetter,);
    this.registerInclusionResolver('season', this.season.inclusionResolver);
    this.league = this.createBelongsToAccessorFor('league', leagueRepositoryGetter,);
    this.registerInclusionResolver('league', this.league.inclusionResolver);
  }
}
