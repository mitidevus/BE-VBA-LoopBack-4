import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Club, Match, Stadium} from '../models';
import {MatchRepository} from '../repositories';

export class MatchController {
  constructor(
    @repository(MatchRepository)
    public matchRepository: MatchRepository,
  ) {}

  @post('/matches')
  @response(200, {
    description: 'Match model instance',
    content: {'application/json': {schema: getModelSchemaRef(Match)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {
            title: 'NewMatch',
            exclude: ['id'],
          }),
        },
      },
    })
    match: Omit<Match, 'id'>,
  ): Promise<Match> {
    return this.matchRepository.create(match);
  }

  @get('/matches/count')
  @response(200, {
    description: 'Match model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Match) where?: Where<Match>): Promise<Count> {
    return this.matchRepository.count(where);
  }

  @get('/matches')
  @response(200, {
    description: 'Array of Match model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Match, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Match) filter?: Filter<Match>): Promise<Match[]> {
    return this.matchRepository.find(filter);
  }

  @patch('/matches')
  @response(200, {
    description: 'Match PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {partial: true}),
        },
      },
    })
    match: Match,
    @param.where(Match) where?: Where<Match>,
  ): Promise<Count> {
    return this.matchRepository.updateAll(match, where);
  }

  @get('/matches/{id}')
  @response(200, {
    description: 'Match model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Match, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Match, {exclude: 'where'})
    filter?: FilterExcludingWhere<Match>,
  ): Promise<Match> {
    return this.matchRepository.findById(id, filter);
  }

  @patch('/matches/{id}')
  @response(204, {
    description: 'Match PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {partial: true}),
        },
      },
    })
    match: Match,
  ): Promise<void> {
    await this.matchRepository.updateById(id, match);
  }

  @put('/matches/{id}')
  @response(204, {
    description: 'Match PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() match: Match,
  ): Promise<void> {
    await this.matchRepository.replaceById(id, match);
  }

  @del('/matches/{id}')
  @response(204, {
    description: 'Match DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.matchRepository.deleteById(id);
  }

  @get('/matches/{leagueSeasonId}/leagueSeason', {
    responses: {
      '200': {
        description: 'Array of Match model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Match, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findByLeagueSeasonId(
    @param.path.number('leagueSeasonId') leagueSeasonId: number,
    @param.filter(Match) filter?: Filter<Match>,
  ): Promise<Match[]> {
    const where: Where<Match> = {
      leagueSeasonId: leagueSeasonId,
    };

    return this.matchRepository.find({where, ...filter});
  }

  @get('/matches/{id}/homeClub', {
    responses: {
      '200': {
        description: 'Club belonging to Match',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Club),
          },
        },
      },
    },
  })
  async getHomeClub(
    @param.path.string('id') id: typeof Match.prototype.id,
  ): Promise<Club> {
    return this.matchRepository.homeClub(id);
  }

  @get('/matches/{id}/awayClub', {
    responses: {
      '200': {
        description: 'Club belonging to Match',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Club),
          },
        },
      },
    },
  })
  async getAwayClub(
    @param.path.string('id') id: typeof Match.prototype.id,
  ): Promise<Club> {
    return this.matchRepository.awayClub(id);
  }

  @get('/matches/{id}/stadium', {
    responses: {
      '200': {
        description: 'Stadium belonging to Match',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Stadium),
          },
        },
      },
    },
  })
  async getStadium(
    @param.path.string('id') id: typeof Match.prototype.id,
  ): Promise<Stadium> {
    return this.matchRepository.stadium(id);
  }
}
