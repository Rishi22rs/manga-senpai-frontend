import * as cheerio from 'cheerio';
import {API} from './api';

export const genrePage = async () => {
  let genres = [];

  const res = await fetch(API);
  const html = await res.text();
  const $ = cheerio.load(html);

  $('.genres li').each((i, el) => {
    const link = $(el).find('a').attr('href');
    if (!link) return; // Skip invalid <li>

    const item = {};

    // Link
    item.link = link;

    // Banner image
    item.banner = $(el).find('.full_img img').attr('src') || '';

    // Title
    item.genre = $(el).find('h3').text();

    // Chapter count (mask or bottom)
    item.count =
      $(el).find('.mask .count').text().trim() ||
      $(el).find('.info_bottom .count').text().trim();

    genres.push(item);
  });

  return genres;
};
