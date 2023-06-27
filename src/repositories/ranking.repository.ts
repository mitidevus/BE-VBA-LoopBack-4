import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Ranking, RankingRelations, Club} from '../models';
import {ClubRepository} from './club.repository';

export class RankingRepository extends DefaultCrudRepository<
  Ranking,
  typeof Ranking.prototype.id,
  RankingRelations
> {

  public readonly club: BelongsToAccessor<Club, typeof Ranking.prototype.id>;

  constructor(@inject('datasources.db') dataSource: DbDataSource, @repository.getter('ClubRepository') protected clubRepositoryGetter: Getter<ClubRepository>,) {
    super(Ranking, dataSource);
    this.club = this.createBelongsToAccessorFor('club', clubRepositoryGetter,);
    this.registerInclusionResolver('club', this.club.inclusionResolver);
  }
}
