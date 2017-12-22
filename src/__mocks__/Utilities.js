class Utilities {
  createResourceUrl(param, cache, resid) {
    let str = '';
    if (typeof param == 'object') {
      for (let key in object) {
        if (key[value] != undefined) {
          str += JSON.stringify(key);
        }
      }
    } else {
      str = JSON.stringify(param);
    }
    const uri = new Uri(
      `http://dummyportlet/?${str}&portletId=${resid}&${cache}`
    );
    return uri.toString();
  }
  getInitiatingPortletId(url) {
    let str = url.match(/context.*\?/);
    if (str !== null) {
      str = str[0].split('/')[1];
    }
    return str;
  }
  isResourceUrl(url) {
    let flag = false,
      str = url.match(/context.*\?/);
    if (str !== null) {
      str = str[0].split('/')[2];
      if (str === 'RESOURCE') {
        flag = true;
      }
    }
    return flag;
  }
  getCacheability(url) {
    let str = url.match(/context.*\?/);
    if (str !== null) {
      str = str[0].split('/')[3];
    }
    return str;
  }
}
export default Utilities;
