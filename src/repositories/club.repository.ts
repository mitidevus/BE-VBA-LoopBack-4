import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Club, ClubRelations} from '../models';

export class ClubRepository extends DefaultCrudRepository<
  Club,
  typeof Club.prototype.id,
  ClubRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Club, dataSource);
  }
}
