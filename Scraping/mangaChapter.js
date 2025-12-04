import cheerio from 'cheerio';

let imgURLs = [];

function extractThzq(text) {
  const match = text.match(/var\s+thzq\s*=\s*\[(.*?)\];?/s);
  if (!match) return null;

  // Extract inside [ ... ]
  const arrayContent = match[1];

  // Split into individual URLs
  const urls = arrayContent
    .split(/,(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/) // split by commas outside quotes
    .map(s => s.trim().replace(/^'|'$/g, '')); // remove quotes and trim

  return urls;
}

export const mangaChapter = async url => {
  console.log('urlll', url);
  let tmp = [];
  await fetch(url)
    .then(res => res.text())
    .then(text => {
      // const $ = cheerio.load(text);
      // $('.wrap_img.uk-width-1-1').each((i, el) => {
      //   tmp = $(el).find('img').attr('src');
      // });
      tmp = extractThzq(text);
    });
  return tmp;
};
