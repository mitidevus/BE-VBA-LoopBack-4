import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import axios from 'axios';
import cheerio from 'cheerio';
import slugify from 'slugify';
import {LeagueSeason, Stadium} from '../models';
import {FileService} from './file.service';

@injectable({scope: BindingScope.TRANSIENT})
export class StadiumService {
  constructor(@service(FileService) public fileService: FileService) {}

  async crawlStadiums(leagueSeasons: LeagueSeason[]): Promise<Stadium[]> {
    try {
      console.log('Crawling Stadiums...');

      const stadiums: Stadium[] = [];

      for (const leagueSeason of leagueSeasons) {
        const response = await axios.get(
          `https://hosted.dcd.shared.geniussports.com/embednf/VBA/en/competition/${leagueSeason.VBAId}/schedule?&iurl=https%3A%2F%2Fvba.vn%2Ffixtures%3F%26WHurl%3D%252Fcompetition%252F${leagueSeason.VBAId}%252Fschedule&_ht=1&_hsm=1&_cc=1&_mf=1`,
        );
        const html = response.data;
        const $ = cheerio.load(html.html);

        $('.match-venue').each((index, element) => {
          const stadiumElement = $(element).find('.venuename');
          const stadiumId = stadiumElement
            ?.attr('href')
            ?.split('%2F')
            ?.pop()
            ?.slice(0, -3);
          const VBAId = parseInt(stadiumId ?? '');

          const existingStadium = stadiums.find(
            stadium => stadium.VBAId === VBAId,
          );
          if (!existingStadium) {
            const name = stadiumElement.text().trim();
            const id = slugify(name, {lower: true});

            const stadium = new Stadium({
              id,
              VBAId,
              name,
            });

            stadiums.push(stadium);
          }
        });
      }

      console.log('Crawled Stadiums successfully!');

      return stadiums;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
