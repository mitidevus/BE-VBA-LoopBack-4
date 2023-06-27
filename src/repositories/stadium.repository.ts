import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Match, Stadium, StadiumRelations} from '../models';

export class StadiumRepository extends DefaultCrudRepository<
  Stadium,
  typeof Stadium.prototype.id,
  StadiumRelations
> {
  public readonly matches: HasManyRepositoryFactory<
    Match,
    typeof Stadium.prototype.id
  >;

  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Stadium, dataSource);
  }
}
