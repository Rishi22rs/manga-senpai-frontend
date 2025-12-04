import cheerio from 'cheerio';

export const mangaDetail = async url => {
  let tmp = {chapters: []};
  await fetch(url)
    .then(res => res.text())
    .then(text => {
      const $ = cheerio.load(text);
      tmp['title'] = $('.info .heading').text().trim();
      tmp['alt_name'] = $('.alt_name').text().trim().split(';');
      tmp['author'] = $('.authors a').text().trim();
      let genres = [];
      $('.genres .text_0').each((i, el) => {
        genres.push($(el).text().trim());
      });
      tmp['genres'] = genres;
      tmp['status'] = $('.d-cell-small.value.status.ongoing').text().trim();
      tmp['latest_chapter'] = $('.d-cell-small.value.new_chap').text().trim();
      tmp['update_at'] = $('.d-cell-small.value.updateAt').text().trim();
      tmp['summary'] = $('.summary p').text().trim();
      const chapters = [];

      $('.chapters table tbody tr').each((i, el) => {
        const linkEl = $(el).find('.chapter a');

        const chapterName = linkEl.text().trim();
        const link = linkEl.attr('href') || '';

        chapters.push({chapterName, link});
      });
      tmp['chapters'] = chapters;
      tmp['banner'] = $('.cover img').attr('src');
    });
  return tmp;
};
