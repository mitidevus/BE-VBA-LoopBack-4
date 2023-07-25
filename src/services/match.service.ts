import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import axios from 'axios';
import cheerio from 'cheerio';
import slugify from 'slugify';
import {LeagueSeason, Match} from '../models';
import {FileService} from './file.service';

@injectable({scope: BindingScope.TRANSIENT})
export class MatchService {
  constructor(@service(FileService) public fileService: FileService) {}

  async crawlMatches(leagueSeasons: LeagueSeason[]): Promise<Match[]> {
    try {
      console.log('Crawling Matches...');

      const matches: Match[] = [];

      for (const leagueSeason of leagueSeasons) {
        const response = await axios.get(
          `https://hosted.dcd.shared.geniussports.com/embednf/VBA/en/competition/${leagueSeason.VBAId}/schedule?&_hl=1&_hsm=1`,
        );

        const html = response.data;
        const $ = cheerio.load(html.html);

        $('.match-wrap').each((index, element) => {
          const status = $(element).hasClass('STATUS_COMPLETE')
            ? 'COMPLETE'
            : 'SCHEDULED';

          const matchId = $(element).attr('id');
          const VBAId = matchId ? parseInt(matchId.replace('extfix_', '')) : -1;

          const dateString = $(element)?.find('.match-time span')?.text();
          const date = new Date(dateString)?.toISOString();

          const stadium = $(element).find('.match-venue .venuename').text();

          const homeClubName = $(element)
            .find('.home-team .team-name-full')
            .text();
          const homeClubId = slugify(homeClubName, {lower: true});
          const homeScore =
            status === 'COMPLETE'
              ? parseInt($(element).find('.homescore .fake-cell').text())
              : null;

          const awayClubName = $(element)
            .find('.away-team .team-name-full')
            .text();
          const awayClubId = slugify(awayClubName, {lower: true});
          const awayScore =
            status === 'COMPLETE'
              ? parseInt($(element).find('.awayscore .fake-cell').text())
              : null;

          if (VBAId !== -1) {
            const match = new Match({
              id: slugify(
                `${homeClubId}-${awayClubId}-${leagueSeason.id}-${date}`,
                {
                  lower: true,
                },
              ),
              VBAId,
              leagueSeasonId: leagueSeason.id,
              stadiumId: slugify(stadium, {lower: true}),
              homeClubId,
              awayClubId,
              homeScore,
              awayScore,
              date,
              status,
            });

            matches.push(match);
          }
        });
      }

      console.log('Crawled Matches successfully!');

      return matches;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
