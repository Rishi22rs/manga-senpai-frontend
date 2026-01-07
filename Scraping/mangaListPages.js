import cheerio from 'cheerio';

export const mangaListPages = async url => {
  // let tmp = [];
  // await fetch(url)
  //   .then(res => res.text())
  //   .then(text => {
  //     const $ = cheerio.load(text);
  //     $('.story-list .story-item .story-name a').each(async (i, item) => {
  //       tmp.push({link: item.attribs.href, title: $(item).text()});
  //     });
  //     $('.story-list .story-item .tooltip img').each(async (i, item) => {
  //       tmp[i] = {...tmp[i], banner: item.attribs.src};
  //     });
  //     $('.story-list .story-item').each(async (i, item) => {
  //       tmp[i] = {...tmp[i], detail: $(item).find('span').first().text()};
  //     });
  //     tmp[0] = {
  //       ...tmp[0],
  //       numOfPages: parseInt($('.go-p-end').text().match(/(\d+)/)[0]),
  //     };
  //   });
  // return tmp;
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122',
    },
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  const mangaList = [];

  $('#book_list .item').each((_, el) => {
    const titleEl = $(el).find('h3.title a');

    const name = titleEl.text().trim();
    const link = titleEl.attr('href');
    const image = $(el).find('.wrap_img img').attr('src');

    if (name && link) {
      mangaList.push({
        name,
        image,
        link,
      });
    }
  });

  // pagination
  let totalPages = 1;
  $('.uk-pagination a.page-numbers').each((_, el) => {
    const num = parseInt($(el).text().trim(), 10);
    if (!isNaN(num)) totalPages = Math.max(totalPages, num);
  });

  console.log({mangaList, totalPages});

  return {mangaList, totalPages};
};
