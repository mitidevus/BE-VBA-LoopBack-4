import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import axios from 'axios';
import cheerio from 'cheerio';
import {LeagueSeason} from '../models';
import {FileService} from './file.service';

type LeagueSeasonMap = {
  [key: number]: {
    id: number;
    leagueId: number;
    seasonId: number;
  };
};

@injectable({scope: BindingScope.TRANSIENT})
export class LeagueSeasonService {
  constructor(@service(FileService) public fileService: FileService) {}

  async crawlLeagueSeasons(): Promise<LeagueSeason[]> {
    try {
      console.log('Crawling Leagues-Seasons...');

      const response = await axios.get(
        'https://hosted.dcd.shared.geniussports.com/embednf/VBA/en/schedule?&iurl=https%3A%2F%2Fvba.vn%2Ffixtures&_ht=1&_hsm=1&_cc=1&_mf=1',
      );
      const html = response.data;

      const $ = cheerio.load(html.html);

      const compdataScript = $('script:contains("compdata")').html();
      if (!compdataScript) {
        throw new Error('compdataScript not found');
      }

      const leagueSeasons: LeagueSeason[] = [];

      let match;
      const regex =
        /else\s*{\s*compdata\.push\(\['(.*?)','(.*?)', (.*?), '(.*?)', (.*?)\]\)/g;
      while ((match = regex.exec(compdataScript))) {
        const [, , , , , leagueSeasonId] = match;

        const VBAId = parseInt(leagueSeasonId);

        const leagueSeasonsMap: LeagueSeasonMap = {
          36188: {id: 1, leagueId: 1, seasonId: 1},
          30506: {id: 2, leagueId: 2, seasonId: 3},
          29853: {id: 3, leagueId: 3, seasonId: 3},
          33841: {id: 4, leagueId: 4, seasonId: 2},
          27726: {id: 5, leagueId: 4, seasonId: 4},
          33770: {id: 6, leagueId: 5, seasonId: 2},
          24744: {id: 7, leagueId: 6, seasonId: 5},
          24948: {id: 8, leagueId: 4, seasonId: 5},
          27727: {id: 9, leagueId: 5, seasonId: 4},
          9101: {id: 10, leagueId: 7, seasonId: 8},
          18125: {id: 11, leagueId: 7, seasonId: 7},
          21019: {id: 12, leagueId: 7, seasonId: 6},
        };

        const {id, leagueId, seasonId} = leagueSeasonsMap[VBAId] || {};

        if (id) {
          const leagueSeason = new LeagueSeason({
            id,
            VBAId,
            leagueId,
            seasonId,
          });

          leagueSeasons.push(leagueSeason);
        }
      }

      console.log('Crawled Leagues-Seasons successfully!');

      return leagueSeasons;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
