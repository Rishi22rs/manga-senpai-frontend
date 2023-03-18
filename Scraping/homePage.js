import cheerio from 'cheerio';

export const homePage = async () => {
  let data = {};
  let tmp = [];
  await fetch('https://w.mangairo.com/home')
    .then(res => res.text())
    .then(text => {
      const $ = cheerio.load(text);

      //////////////MONTHLY TRENDING//////////////

      $('.panel_top_daily_manga ul li .title_story .tooltip').each(
        async (i, item) => {
          tmp.push({title: item.attribs?.title, link: item.attribs?.href});
        },
      );
      $('.panel_top_daily_manga ul li img').each(async (i, item) => {
        tmp[i]['banner'] = item.attribs?.src;
      });
      $('.panel_top_daily_manga ul li .chapter_story a').each(
        async (i, item) => {
          tmp[i]['chapter_story_title'] = item.attribs?.title;
          tmp[i]['chapter_story_link'] = item.attribs?.href;
        },
      );
      data['monthlyTrending'] = tmp;

      ///////////////RECENTLY UPDATED//////////////

      tmp = [];
      $('.panel_story_grid .story_item a img').each((i, item) => {
        tmp.push({banner: item.attribs?.src});
      });
      $('.panel_story_grid .story_item .story_title a').each((i, item) => {
        tmp[i]['title'] = $(item).text();
        tmp[i]['link'] = item.attribs?.href;
      });
      data['recentlyUpdated'] = tmp;  

      ///////////////NEW MANGA//////////////

      tmp = [];
      $('.panel_top_new_manga_content ul li .title_story .tooltip').each(
        async (i, item) => {
          tmp.push({title: item.attribs?.title, link: item.attribs?.href});
        },
      );
      $('.panel_top_new_manga_content ul li img').each(async (i, item) => {
        tmp[i]['banner'] = item.attribs?.src;
      });
      $('.panel_top_new_manga_content ul li .chapter_story a').each(
        async (i, item) => {
          tmp[i]['chapter_story_title'] = $(item).text();
          tmp[i]['chapter_story_link'] = item.attribs?.href;
        },
      );
      data['newManga'] = tmp;
    });
  return data;
};
