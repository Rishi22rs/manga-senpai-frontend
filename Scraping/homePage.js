// import cheerio from 'cheerio';

// export const homePage = async () => {
//   let data = {};
//   let tmp = [];
//   await fetch('https://mangakatana.com/')
//     .then(res => res.text())
//     .then(text => {
//       const $ = cheerio.load(text);

//       //////////////MONTHLY TRENDING//////////////

//       $('.book_list ul li .title_story .tooltip').each(
//         async (i, item) => {
//           tmp.push({title: item.attribs?.title, link: item.attribs?.href});
//         },
//       );
//       $('.panel_top_daily_manga ul li img').each(async (i, item) => {
//         tmp[i]['banner'] = item.attribs?.src;
//       });
//       $('.panel_top_daily_manga ul li .chapter_story a').each(
//         async (i, item) => {
//           tmp[i]['chapter_story_title'] = item.attribs?.title;
//           tmp[i]['chapter_story_link'] = item.attribs?.href;
//         },
//       );
//       data['monthlyTrending'] = tmp;

//       ///////////////RECENTLY UPDATED//////////////

//       tmp = [];
//       $('.panel_story_grid .story_item a img').each((i, item) => {
//         tmp.push({banner: item.attribs?.src});
//       });
//       $('.panel_story_grid .story_item .story_title a').each((i, item) => {
//         tmp[i]['title'] = $(item).text();
//         tmp[i]['link'] = item.attribs?.href;
//       });
//       data['recentlyUpdated'] = tmp;

//       ///////////////NEW MANGA//////////////

//       tmp = [];
//       $('.panel_top_new_manga_content ul li .title_story .tooltip').each(
//         async (i, item) => {
//           tmp.push({title: item.attribs?.title, link: item.attribs?.href});
//         },
//       );
//       $('.panel_top_new_manga_content ul li img').each(async (i, item) => {
//         tmp[i]['banner'] = item.attribs?.src;
//       });
//       $('.panel_top_new_manga_content ul li .chapter_story a').each(
//         async (i, item) => {
//           tmp[i]['chapter_story_title'] = $(item).text();
//           tmp[i]['chapter_story_link'] = item.attribs?.href;
//         },
//       );
//       data['newManga'] = tmp;
//     });

//   console.log('ddataa', data);
//   return data;
// };

import cheerio from 'cheerio';
import {API} from './api';

export const homePage = async () => {
  let data = [];

  const res = await fetch(API);
  const text = await res.text();
  const $ = cheerio.load(text);

  $('#book_list .item').each((i, el) => {
    let item = {};

    // Cover
    item.banner = $(el).find('.wrap_img img').attr('src') || '';

    // Status
    item.status = $(el).find('.status').text().trim();

    // Title + Manga link
    const titleEl = $(el).find('.text h3.title a').first();
    item.title = titleEl.text().trim();
    item.link = titleEl.attr('href');

    // Chapter update text (e.g. “Update chapter 381”)
    item.update_text = $(el).find('h3.title span').text().trim();

    // Time ago (e.g., "17 minutes ago")
    item.time = $(el).find('.uk-width-1-2 .date').first().text().trim();

    // Genres
    item.genres = [];
    $(el)
      .find('.genres a')
      .each((i, g) => {
        item.genres.push($(g).text().trim());
      });

    // Summary
    item.summary = $(el).find('.summary').text().trim();

    // Chapters list
    item.chapters = [];

    $(el)
      .find('.chapters .uk-grid-small .uk-width-8-10')
      .each((idx, chapterEl) => {
        const chapterLinkEl = $(chapterEl).find('.chapter a');
        let chap = {
          chapter_title: chapterLinkEl.text().trim(),
          chapter_link: chapterLinkEl.attr('href') || '',
          update_time:
            $(chapterEl)
              .next('.uk-width-2-10')
              .find('.update_time')
              .text()
              .trim() || '',
        };
        item.chapters.push(chap);
      });

    data.push(item);
  });

  ////// HOT UPDATES
  let hotUpdates = [];
  $('.slick_book li .item').each((i, el) => {
    const item = {};

    item.id = $(el).attr('data-id') || '';
    item.genres = ($(el).attr('data-genre') || '')
      .split(',')
      .filter(x => x.trim() !== '');

    // Title + link
    const titleEl = $(el).find('h3.title a');
    item.title = titleEl.text().trim();
    item.link = titleEl.attr('href');

    // Banner image
    item.banner = $(el).find('.wrap_img img').attr('src') || '';

    // Chapter
    const chapterEl = $(el).find('.chapter a');
    item.chapter_title = chapterEl.text().trim();
    item.chapter_link = chapterEl.attr('href');

    hotUpdates.push(item);
  });

  // HOT MANGA

  const hotManga = [];

  $('#hot_book .item').each((i, el) => {
    const element = $(el);

    const title = element.find('.title a').text().trim();
    const link = element.find('.title a').attr('href') || '';

    const banner = element.find('img').attr('data-src') || '';

    const status = element.find('.status').text().trim();

    const chapterText = element.find('.chapter a').text().trim();
    const chapterUrl = element.find('.chapter a').attr('href') || '';

    hotManga.push({
      title,
      link,
      banner,
      status,
      chapter: chapterText,
      chapterUrl,
    });
  });

  return {
    monthlyTrending: data,
    recentlyUpdated: hotUpdates,
    newManga: hotManga,
  };
};
