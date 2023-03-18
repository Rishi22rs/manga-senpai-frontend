import cheerio from 'cheerio';

export const mangaListPages = async url => {
  let tmp = [];
  await fetch(url)
    .then(res => res.text())
    .then(text => {
      const $ = cheerio.load(text);
      $('.story-list .story-item .story-name a').each(async (i, item) => {
        tmp.push({link: item.attribs.href, title: $(item).text()});
      });
      $('.story-list .story-item .tooltip img').each(async (i, item) => {
        tmp[i] = {...tmp[i], banner: item.attribs.src};
      });
      $('.story-list .story-item').each(async (i, item) => {
        tmp[i] = {...tmp[i], detail: $(item).find('span').first().text()};
      });
      tmp[0] = {
        ...tmp[0],
        numOfPages: parseInt($('.go-p-end').text().match(/(\d+)/)[0]),
      };
    });
  return tmp;
};
