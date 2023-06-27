import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import axios from 'axios';
import cheerio from 'cheerio';
import slugify from 'slugify';
import {LeagueSeason, Ranking} from '../models';
import {FileService} from './file.service';

@injectable({scope: BindingScope.TRANSIENT})
export class RankingService {
  constructor(@service(FileService) public fileService: FileService) {}

  async crawlRankings(leagueSeasons: LeagueSeason[]): Promise<Ranking[]> {
    try {
      console.log('Crawling Rankings...');

      const rankings: Ranking[] = [];

      for (const leagueSeason of leagueSeasons) {
        const response = await axios.get(
          `https://hosted.dcd.shared.geniussports.com/VBA/en/competition/${leagueSeason.VBAId}/standings`,
        );

        const html = response.data;
        const $ = cheerio.load(html);

        $('tbody tr').each((index, element) => {
          const clubName = $(element)
            .find('.team-name .team-name-full')
            .text()
            .trim();
          const clubId = slugify(clubName, {lower: true});

          const position = parseInt(
            $(element).find('td:nth-child(1)').text().trim(),
          );
          const gamesPlayed = parseInt(
            $(element).find('.STANDINGS_played').text().trim(),
          );
          const won = parseInt($(element).find('.STANDINGS_won').text().trim());
          const lost = parseInt(
            $(element).find('.STANDINGS_lost').text().trim(),
          );
          const percentageWon = parseInt(
            $(element).find('.STANDINGS_percentageWon').text().trim(),
          );
          const scoredFor = parseInt(
            $(element).find('.STANDINGS_scoredFor').text().trim(),
          );
          const scoredAgainst = parseInt(
            $(element).find('.STANDINGS_scoredAgainst').text().trim(),
          );
          const pointsDiff = parseInt(
            $(element).find('.STANDINGS_pointsDiff').text().trim(),
          );
          const streak = parseInt(
            $(element).find('.STANDINGS_streak').text().trim(),
          );

          const rankingId = `${leagueSeason.id}-${clubId}`;

          const ranking = new Ranking({
            id: rankingId,
            leagueSeasonId: leagueSeason.id,
            clubId,
            position,
            gamesPlayed,
            won,
            lost,
            percentageWon,
            scoredFor,
            scoredAgainst,
            pointsDiff,
            streak,
          });

          rankings.push(ranking);
        });
      }

      console.log('Crawled Rankings successfully!');

      return rankings;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
