import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import axios from 'axios';
import cheerio from 'cheerio';
import slugify from 'slugify';
import {Club} from '../models';
import {FileService} from './file.service';

async function crawlClubData(url: string): Promise<Club> {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const name = $('h6.section-heading__title')
    .text()
    .trim()
    .replace('THÔNG TIN CÂU LẠC BỘ ', '');

  let slugId = slugify(name, {lower: true});

  if (slugId === 'hochiminh-city-wings') {
    slugId = 'ho-chi-minh-city-wings';
  } else if (slugId === 'nhatrang-dolphins') {
    slugId = 'nha-trang-dolphins';
  }

  const address = $('.styles_section-club-info__1d5ac .fa-map-marked')
    .siblings('div')
    .text();

  const website =
    $('.styles_section-club-info__1d5ac a[href^="http"]').eq(0).attr('href') ??
    'Đang cập nhật';

  const email = $('.styles_section-club-info__1d5ac a[href^="mailto"]')
    .clone()
    .children()
    .remove()
    .end()
    .text()
    .trim();

  const phone = $('.styles_section-club-info__1d5ac a[href^="tel"]')
    .text()
    .trim();

  const history = $('.styles_section-club-info__history__2B_7s div').text();

  const image = $('img.img-fluid.d-inline-block').attr('src');

  //Get the club ID to get the logo
  const regex = /"page"\s*:\s*"\/competition\/\d+\/team\/(\d+)\/roster"/;
  const scriptTag = $('script:contains("window.spilWHH_HNB_roster")').html();
  const match = scriptTag ? scriptTag.match(regex) : null;
  const VBAId = match ? parseInt(match[1]) : -1;

  // Get the club logo
  const logoUrl = `https://hosted.dcd.shared.geniussports.com/embednf/VBA/en/teams`;
  const logoResponse = await axios.get(logoUrl);
  const logoHtml = logoResponse.data.html;
  const $$ = cheerio.load(logoHtml);
  const logo = $$(`a[href*="/team/${VBAId}"] img`).attr('src');

  return new Club({
    id: slugId,
    VBAId,
    name,
    logo,
    image,
    address,
    website,
    email,
    phone,
    history,
  });
}

@injectable({scope: BindingScope.TRANSIENT})
export class ClubService {
  constructor(@service(FileService) public fileService: FileService) {}

  async crawlClubs(): Promise<Club[]> {
    try {
      console.log('Crawling Clubs...');

      const response = await axios.get('https://vba.vn/clubs');
      const html = response.data;
      const $ = cheerio.load(html);

      const clubs: Club[] = [];

      const clubLinks = $('.styles_section-club__item__15uTy[href^="/clubs/"]');

      for (let i = 0; i < clubLinks.length; i++) {
        const clubLink = clubLinks.eq(i).attr('href');
        const clubUrl = `https://vba.vn${clubLink}`;
        const data = await crawlClubData(clubUrl);
        if (data.VBAId !== -1) {
          clubs.push(data);
        }
      }

      console.log('Crawled Clubs successfully!');

      return clubs;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
