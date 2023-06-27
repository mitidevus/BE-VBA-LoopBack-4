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
import {Season} from '../models';
import {SeasonRepository} from '../repositories';

export class SeasonController {
  constructor(
    @repository(SeasonRepository)
    public seasonRepository: SeasonRepository,
  ) // @service(CrawlDataService)
  // public crawlDataService: CrawlDataService,
  {}

  @post('/seasons')
  @response(200, {
    description: 'Season model instance',
    content: {'application/json': {schema: getModelSchemaRef(Season)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Season, {
            title: 'NewSeason',
            exclude: ['id'],
          }),
        },
      },
    })
    season: Omit<Season, 'id'>,
  ): Promise<Season> {
    return this.seasonRepository.create(season);
  }

  @get('/seasons/count')
  @response(200, {
    description: 'Season model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Season) where?: Where<Season>): Promise<Count> {
    return this.seasonRepository.count(where);
  }

  @get('/seasons')
  @response(200, {
    description: 'Array of Season model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Season, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Season) filter?: Filter<Season>): Promise<Season[]> {
    return this.seasonRepository.find(filter);
  }

  @patch('/seasons')
  @response(200, {
    description: 'Season PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Season, {partial: true}),
        },
      },
    })
    season: Season,
    @param.where(Season) where?: Where<Season>,
  ): Promise<Count> {
    return this.seasonRepository.updateAll(season, where);
  }

  @get('/seasons/{id}')
  @response(200, {
    description: 'Season model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Season, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Season, {exclude: 'where'})
    filter?: FilterExcludingWhere<Season>,
  ): Promise<Season> {
    return this.seasonRepository.findById(id, filter);
  }

  @patch('/seasons/{id}')
  @response(204, {
    description: 'Season PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Season, {partial: true}),
        },
      },
    })
    season: Season,
  ): Promise<void> {
    await this.seasonRepository.updateById(id, season);
  }

  @put('/seasons/{id}')
  @response(204, {
    description: 'Season PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() season: Season,
  ): Promise<void> {
    await this.seasonRepository.replaceById(id, season);
  }

  @del('/seasons/{id}')
  @response(204, {
    description: 'Season DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.seasonRepository.deleteById(id);
  }
}
