import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Match, MatchRelations, Club, Stadium} from '../models';
import {ClubRepository} from './club.repository';
import {StadiumRepository} from './stadium.repository';

export class MatchRepository extends DefaultCrudRepository<
  Match,
  typeof Match.prototype.id,
  MatchRelations
> {

  public readonly homeClub: BelongsToAccessor<Club, typeof Match.prototype.id>;

  public readonly awayClub: BelongsToAccessor<Club, typeof Match.prototype.id>;

  public readonly stadium: BelongsToAccessor<Stadium, typeof Match.prototype.id>;

  constructor(@inject('datasources.db') dataSource: DbDataSource, @repository.getter('ClubRepository') protected clubRepositoryGetter: Getter<ClubRepository>, @repository.getter('StadiumRepository') protected stadiumRepositoryGetter: Getter<StadiumRepository>,) {
    super(Match, dataSource);
    this.stadium = this.createBelongsToAccessorFor('stadium', stadiumRepositoryGetter,);
    this.registerInclusionResolver('stadium', this.stadium.inclusionResolver);
    this.awayClub = this.createBelongsToAccessorFor('awayClub', clubRepositoryGetter,);
    this.registerInclusionResolver('awayClub', this.awayClub.inclusionResolver);
    this.homeClub = this.createBelongsToAccessorFor('homeClub', clubRepositoryGetter,);
    this.registerInclusionResolver('homeClub', this.homeClub.inclusionResolver);
  }
}
