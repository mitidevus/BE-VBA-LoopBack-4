import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Season, SeasonRelations} from '../models';

export class SeasonRepository extends DefaultCrudRepository<
  Season,
  typeof Season.prototype.id,
  SeasonRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Season, dataSource);
  }
}
