import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Club, ClubWithRelations} from './club.model';

@model()
export class Ranking extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @belongsTo(() => Club)
  clubId: string;

  @property({
    type: 'number',
    default: 0,
  })
  leagueSeasonId: number;

  @property({
    type: 'number',
    default: 0,
  })
  position: number;

  @property({
    type: 'number',
    default: 0,
  })
  gamesPlayed: number;

  @property({
    type: 'number',
    default: 0,
  })
  won: number;

  @property({
    type: 'number',
    default: 0,
  })
  lost: number;

  @property({
    type: 'number',
    default: 0,
  })
  percentageWon: number;

  @property({
    type: 'number',
    default: 0,
  })
  scoredFor: number;

  @property({
    type: 'number',
    default: 0,
  })
  scoredAgainst?: number;

  @property({
    type: 'number',
    default: 0,
  })
  pointsDiff?: number;

  @property({
    type: 'number',
    default: 0,
  })
  streak?: number;

  constructor(data?: Partial<Ranking>) {
    super(data);
  }
}

export interface RankingRelations {
  // describe navigational properties here
  club?: ClubWithRelations;
}

export type RankingWithRelations = Ranking & RankingRelations;
