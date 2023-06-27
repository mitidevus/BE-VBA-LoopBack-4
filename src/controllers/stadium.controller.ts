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
import {Stadium} from '../models';
import {StadiumRepository} from '../repositories';

export class StadiumController {
  constructor(
    @repository(StadiumRepository)
    public stadiumRepository: StadiumRepository,
  ) {}

  @post('/stadiums')
  @response(200, {
    description: 'Stadium model instance',
    content: {'application/json': {schema: getModelSchemaRef(Stadium)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stadium, {
            title: 'NewStadium',
            exclude: ['id'],
          }),
        },
      },
    })
    stadium: Omit<Stadium, 'id'>,
  ): Promise<Stadium> {
    return this.stadiumRepository.create(stadium);
  }

  @get('/stadiums/count')
  @response(200, {
    description: 'Stadium model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Stadium) where?: Where<Stadium>): Promise<Count> {
    return this.stadiumRepository.count(where);
  }

  @get('/stadiums')
  @response(200, {
    description: 'Array of Stadium model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Stadium, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Stadium) filter?: Filter<Stadium>,
  ): Promise<Stadium[]> {
    return this.stadiumRepository.find(filter);
  }

  @patch('/stadiums')
  @response(200, {
    description: 'Stadium PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stadium, {partial: true}),
        },
      },
    })
    stadium: Stadium,
    @param.where(Stadium) where?: Where<Stadium>,
  ): Promise<Count> {
    return this.stadiumRepository.updateAll(stadium, where);
  }

  @get('/stadiums/{id}')
  @response(200, {
    description: 'Stadium model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Stadium, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Stadium, {exclude: 'where'})
    filter?: FilterExcludingWhere<Stadium>,
  ): Promise<Stadium> {
    return this.stadiumRepository.findById(id, filter);
  }

  @patch('/stadiums/{id}')
  @response(204, {
    description: 'Stadium PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stadium, {partial: true}),
        },
      },
    })
    stadium: Stadium,
  ): Promise<void> {
    await this.stadiumRepository.updateById(id, stadium);
  }

  @put('/stadiums/{id}')
  @response(204, {
    description: 'Stadium PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() stadium: Stadium,
  ): Promise<void> {
    await this.stadiumRepository.replaceById(id, stadium);
  }

  @del('/stadiums/{id}')
  @response(204, {
    description: 'Stadium DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.stadiumRepository.deleteById(id);
  }
}
