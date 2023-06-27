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
import {Club, Ranking} from '../models';
import {RankingRepository} from '../repositories';

export class RankingController {
  constructor(
    @repository(RankingRepository)
    public rankingRepository: RankingRepository,
  ) {}

  @post('/rankings')
  @response(200, {
    description: 'Ranking model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ranking)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ranking, {
            title: 'NewRanking',
            exclude: ['id'],
          }),
        },
      },
    })
    ranking: Omit<Ranking, 'id'>,
  ): Promise<Ranking> {
    return this.rankingRepository.create(ranking);
  }

  @get('/rankings/count')
  @response(200, {
    description: 'Ranking model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Ranking) where?: Where<Ranking>): Promise<Count> {
    return this.rankingRepository.count(where);
  }

  @get('/rankings')
  @response(200, {
    description: 'Array of Ranking model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ranking, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Ranking) filter?: Filter<Ranking>,
  ): Promise<Ranking[]> {
    return this.rankingRepository.find(filter);
  }

  @patch('/rankings')
  @response(200, {
    description: 'Ranking PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ranking, {partial: true}),
        },
      },
    })
    ranking: Ranking,
    @param.where(Ranking) where?: Where<Ranking>,
  ): Promise<Count> {
    return this.rankingRepository.updateAll(ranking, where);
  }

  @get('/rankings/{id}')
  @response(200, {
    description: 'Ranking model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ranking, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Ranking, {exclude: 'where'})
    filter?: FilterExcludingWhere<Ranking>,
  ): Promise<Ranking> {
    return this.rankingRepository.findById(id, filter);
  }

  @patch('/rankings/{id}')
  @response(204, {
    description: 'Ranking PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ranking, {partial: true}),
        },
      },
    })
    ranking: Ranking,
  ): Promise<void> {
    await this.rankingRepository.updateById(id, ranking);
  }

  @put('/rankings/{id}')
  @response(204, {
    description: 'Ranking PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ranking: Ranking,
  ): Promise<void> {
    await this.rankingRepository.replaceById(id, ranking);
  }

  @del('/rankings/{id}')
  @response(204, {
    description: 'Ranking DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.rankingRepository.deleteById(id);
  }

  @get('/rankings/{id}/club', {
    responses: {
      '200': {
        description: 'Club belonging to Ranking',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Club),
          },
        },
      },
    },
  })
  async getClub(
    @param.path.string('id') id: typeof Ranking.prototype.id,
  ): Promise<Club> {
    return this.rankingRepository.club(id);
  }

  @get('/rankings/{leagueSeasonId}/leagueSeason', {
    responses: {
      '200': {
        description: 'Array of Match model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Ranking, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findByLeagueSeasonId(
    @param.path.number('leagueSeasonId') leagueSeasonId: number,
    @param.filter(Ranking) filter?: Filter<Ranking>,
  ): Promise<Ranking[]> {
    const where: Where<Ranking> = {
      leagueSeasonId: leagueSeasonId,
    };

    return this.rankingRepository.find({where, ...filter});
  }
}
