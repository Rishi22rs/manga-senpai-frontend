import cheerio from 'cheerio';

let imgURLs = [];

export const mangaChapter = async (setImgBase64, setLoadedCount,url) => {
  let imgURLs = [];
  await fetch(url)
    .then(res => res.text())
    .then(text => {
      const $ = cheerio.load(text);
      $('.panel-read-story img').each(async (i, item) => {
        imgURLs.push(item.attribs.src);
      });
    });
  let data = [];
  let urlHashtable = {};
  const chapterCount=imgURLs.length
  let countdown = imgURLs.length;
  imgURLs.map(url => (urlHashtable[url] = ''));
  await Promise.all(
    imgURLs.map(async url => {
      const response = await fetch(url, {
        headers: {
          authority: 's1.mkklcdnv6tempv2.com',
          method: 'GET',
          path: '/mangakakalot/p1/please_dont_bully_me_nagatoro/chapter_0_branchoff_edition/1.jpg',
          scheme: 'https',
          accept:
            'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          dnt: 1,
          pragma: 'no-cache',
          referer: 'https://chap.mangairo.com/',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': 'Windows',
          'sec-fetch-dest': 'image',
          'sec-fetch-mode': 'no-cors',
          'sec-fetch-site': 'cross-site',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
        },
      });
      const imageBlob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = () => {
        const base64data = reader.result;
        data.push(base64data);
        countdown--;
        setLoadedCount(((chapterCount-countdown)/chapterCount)*100)
        urlHashtable[url] = base64data;
        countdown === 0 &&
          setImgBase64(Object.keys(urlHashtable).map(url => urlHashtable[url]));
      };
    }),
  );
  // setImgBase64(Object.keys(urlHashtable).map(url => urlHashtable[url]));
};
