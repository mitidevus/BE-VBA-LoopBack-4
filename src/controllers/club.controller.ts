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
import {Club} from '../models';
import {ClubRepository} from '../repositories';

export class ClubController {
  constructor(
    @repository(ClubRepository)
    public clubRepository: ClubRepository,
  ) {}

  @post('/clubs')
  @response(200, {
    description: 'Club model instance',
    content: {'application/json': {schema: getModelSchemaRef(Club)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Club, {
            title: 'NewClub',
            exclude: ['id'],
          }),
        },
      },
    })
    club: Omit<Club, 'id'>,
  ): Promise<Club> {
    return this.clubRepository.create(club);
  }

  @get('/clubs/count')
  @response(200, {
    description: 'Club model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Club) where?: Where<Club>): Promise<Count> {
    return this.clubRepository.count(where);
  }

  @get('/clubs')
  @response(200, {
    description: 'Array of Club model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Club, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Club) filter?: Filter<Club>): Promise<Club[]> {
    return this.clubRepository.find(filter);
  }

  @patch('/clubs')
  @response(200, {
    description: 'Club PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Club, {partial: true}),
        },
      },
    })
    club: Club,
    @param.where(Club) where?: Where<Club>,
  ): Promise<Count> {
    return this.clubRepository.updateAll(club, where);
  }

  @get('/clubs/{id}')
  @response(200, {
    description: 'Club model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Club, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Club, {exclude: 'where'}) filter?: FilterExcludingWhere<Club>,
  ): Promise<Club> {
    return this.clubRepository.findById(id, filter);
  }

  @patch('/clubs/{id}')
  @response(204, {
    description: 'Club PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Club, {partial: true}),
        },
      },
    })
    club: Club,
  ): Promise<void> {
    await this.clubRepository.updateById(id, club);
  }

  @put('/clubs/{id}')
  @response(204, {
    description: 'Club PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() club: Club,
  ): Promise<void> {
    await this.clubRepository.replaceById(id, club);
  }

  @del('/clubs/{id}')
  @response(204, {
    description: 'Club DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clubRepository.deleteById(id);
  }
}
