let searchTimeoutToken = 0;

export const searching = async (query = '') => {
  let formData = new FormData();
  formData.append('searchword', query);
  clearInterval(searchTimeoutToken);
  if (query.length >= 3) {
    searchTimeoutToken = setTimeout(() => {
      fetch('https://chap.mangairo.com/getsearchstory', {
        method: 'post',
        body: formData,
      })
        .then(res => res.text())
        .then(text => {});
    }, 500);
  }
};
