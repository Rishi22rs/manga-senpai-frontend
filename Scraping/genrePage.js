import cheerio from 'cheerio';

export const genrePage = async () => {
  let tmp = [];
  await fetch('https://w.mangairo.com/home')
    .then(res => res.text())
    .then(text => {
      const $ = cheerio.load(text);
      $('.panel_category a').each(async (i, item) => {
        tmp.push({genre: $(item).text(), link: item.attribs.href});
      });
    });
  return tmp;
};
