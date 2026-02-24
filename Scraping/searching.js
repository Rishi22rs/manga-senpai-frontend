import * as cheerio from 'cheerio';

export const searching = html => {
  const $ = cheerio.load(html);

  const results = [];

  $('.item').each((_, el) => {
    const titleEl = $(el).find('.d-cell.text a.title');

    const name = titleEl.text().trim();
    const link = titleEl.attr('href');

    const image = $(el).find('.wrap_img img').attr('src');

    const lastChapter = $(el).find('.chapter a').text().trim();

    results.push({
      name,
      image,
      lastChapter,
      link,
    });
  });
  return results;
};
