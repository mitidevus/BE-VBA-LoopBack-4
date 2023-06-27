import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {League} from '../models';
import {FileService} from './file.service';

@injectable({scope: BindingScope.TRANSIENT})
export class LeagueService {
  constructor(@service(FileService) public fileService: FileService) {}

  async crawlLeagues(): Promise<League[]> {
    try {
      console.log('Crawling Leagues...');

      const leagues: League[] = await this.fileService.readFromFile<League[]>(
        '../constant/data.json',
        'leagues',
      );

      console.log('Crawled Leagues successfully!');
      return leagues;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
