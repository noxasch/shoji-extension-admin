/* eslint-disable no-multi-str */
const popupHtml = /* html */'<div class="header bb:1 p:12">\
  < div class="input-group" >\
      <input class="form-control" type="search" name="search" id="search"\
       placeholder="Search Extensions">\
      <label for="search"></label>\
    </>\
    <div id="reload" class="button bg:primary ripple fs:16" tabindex="0">\
      reload dev <span class="i:box w:10"></span><span class="mdi mdi-reload"></span>\
    </div>\
  </div >\
  <div class="info-bar bb:1 fs:12 p:12">\
    You have a total of <span class="bold">49</span> extensions. \
    <span class="bold">17</span> enabled extension.<span\
      class="bold">4</span> dev extension.\
  </div>\
  <div class="content oy:scroll">\
    <ul class="list-view fs:12"></ul>\
  </div>\
  <div class="footer p:12 fs:12 flex">\
    <span class="left">Shoji Extension Admin v1.5.2</span>\
    <span class="right">Reload keyboard shortcut: \
    <span><kbd>⌥</kbd>+<kbd>R</kbd></span></span>\
  </div>';

module.exports = popupHtml;
