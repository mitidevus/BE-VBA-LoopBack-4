import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Club, ClubWithRelations} from './club.model';
import {Stadium, StadiumWithRelations} from './stadium.model';

@model()
export class Match extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  VBAId?: number;

  @belongsTo(() => Club)
  homeClubId: string;

  @belongsTo(() => Club)
  awayClubId: string;

  @property({
    type: 'number',
    required: true,
  })
  leagueSeasonId: number;

  @belongsTo(() => Stadium)
  stadiumId: string;

  @property({
    type: 'number',
  })
  homeScore: number | null;

  @property({
    type: 'number',
  })
  awayScore: number | null;

  @property({
    type: 'string',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
  })
  status: string;

  constructor(data?: Partial<Match>) {
    super(data);
  }
}

export interface MatchRelations {
  // describe navigational properties here
  homeClub?: ClubWithRelations;
  awayClub?: ClubWithRelations;
  stadium?: StadiumWithRelations;
}

export type MatchWithRelations = Match & MatchRelations;
