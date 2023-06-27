import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {Season} from '../models';
import {FileService} from './file.service';

@injectable({scope: BindingScope.TRANSIENT})
export class SeasonService {
  constructor(@service(FileService) public fileService: FileService) {}

  async crawlSeasons(): Promise<Season[]> {
    try {
      console.log('Crawling Seasons...');

      const seasons: Season[] = await this.fileService.readFromFile<Season[]>(
        '../constant/data.json',
        'seasons',
      );

      console.log('Crawled Seasons successfully!');
      return seasons;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
