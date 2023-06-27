import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import fs from 'fs';
import path from 'path';
import {
  Club,
  League,
  LeagueSeason,
  Match,
  Ranking,
  Season,
  Stadium,
} from '../models';

interface StoredData {
  clubs: Club[];
  leagues: League[];
  seasons: Season[];
  leagueSeasons: LeagueSeason[];
  stadiums: Stadium[];
  matches: Match[];
  rankings: Ranking[];
}

@injectable({scope: BindingScope.TRANSIENT})
export class FileService {
  constructor(/* Add @inject to inject parameters */) {}

  async storeToFile(
    data: StoredData,
    folderPath: string,
    timestamp: number,
  ): Promise<void> {
    const fileName = `${timestamp}.json`;
    const filePath = path.join(__dirname, folderPath, fileName);

    const dataObject = {
      data,
      timestamp,
    };

    const dataJSON = JSON.stringify(dataObject, null, 2);

    fs.writeFileSync(filePath, dataJSON);
    console.log('Stored to ' + filePath);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async readFromFile<TypeOfData>(
    filePath: string,
    field = '',
  ): Promise<TypeOfData> {
    const readFilePath = path.join(__dirname, filePath);
    const jsonData = fs.readFileSync(readFilePath, 'utf-8');
    const parsedData = JSON.parse(jsonData);
    return (field ? parsedData[field] : parsedData) as TypeOfData;
  }
}
