import {API} from './api';

function extractThzq(html) {
  // Match thzq array including multiline
  const match = html.match(/var\s+thzq\s*=\s*\[(.*?)\];/s);

  if (!match) {
    console.log('thzq array not found');
    return [];
  }

  const arrayContent = match[1];

  // Extract all URLs inside quotes
  const urls = arrayContent.match(/https?:\/\/[^'"]+/g) || [];

  return urls;
}

export const mangaChapter = async url => {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36',
        Referer: API, // VERY IMPORTANT (anti-hotlink)
      },
    });

    const html = await res.text();

    const images = extractThzq(html);

    return images;
  } catch (err) {
    console.log('Chapter fetch error:', err);
    return [];
  }
};
