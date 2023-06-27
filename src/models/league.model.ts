import {Entity, model, property} from '@loopback/repository';

@model()
export class League extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  constructor(data?: Partial<League>) {
    super(data);
  }
}

export interface LeagueRelations {
  // describe navigational properties here
}

export type LeagueWithRelations = League & LeagueRelations;
