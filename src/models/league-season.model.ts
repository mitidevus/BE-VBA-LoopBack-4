import {Entity, belongsTo, model, property} from '@loopback/repository';
import {League, LeagueWithRelations} from './league.model';
import {Season, SeasonWithRelations} from './season.model';

@model()
export class LeagueSeason extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  VBAId: number;

  @belongsTo(() => League)
  leagueId: number;

  @belongsTo(() => Season)
  seasonId: number;

  constructor(data?: Partial<LeagueSeason>) {
    super(data);
  }
}

export interface LeagueSeasonRelations {
  // describe navigational properties here
  league?: LeagueWithRelations;
  season?: SeasonWithRelations;
}

export type LeagueSeasonWithRelations = LeagueSeason & LeagueSeasonRelations;
