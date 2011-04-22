/*
  Google I/O 2011 HTML slides template

  Created by Luke Mahé (lukem@google.com)
         and Marcin Wichary (mwichary@google.com).

  URL: http://go/io-html-slides
*/

var PERMANENT_URL_PREFIX = './';

var curSlide;

function handleBodyKeyDown(event) {
  switch (event.keyCode) {
    case 39: // right arrow
    case 40: // down arrow
    case 13: // Enter
    case 32: // space
    case 34: // PgDn
      nextSlide();
      event.preventDefault();
      break;

    case 37: // left arrow
    case 38: // top arrow
    case 8: // Backspace
    case 33: // PgUp
      prevSlide();
      event.preventDefault();
      break;

  }
}

function getCurSlideFromHash() {
  var slideNo = parseInt(location.hash.substr(1));

  if (slideNo) {
    curSlide = slideNo - 1;
  } else {
    curSlide = 0;
  }
}

function updateHash() {
  location.replace('#' + (curSlide + 1));
}

function triggerEnterEvent(slide, slideNo) {
  if (!slide) {
    return;
  }

  var onEnter = slide.getAttribute('onslideenter');
  if (onEnter) {
    new Function(onEnter).call(slide);
  }

  var evt = document.createEvent('Event');
  evt.initEvent('slideenter', true, true);
  evt.slideNumber = slideNo + 1; // Make it readable

  slide.dispatchEvent(evt);
};

function triggerLeaveEvent(slide, slideNo) {
  if (!slide) {
    return;
  }

  var onLeave = slide.getAttribute('onslideleave');
  if (onLeave) {
    new Function(onLeave).call(slide);
  }

  var evt = document.createEvent('Event');
  evt.initEvent('slideleave', true, true);
  evt.slideNumber = slideNo + 1; // Make it readable
  slideEls[slideNo].dispatchEvent(evt);
};

function updateSlideClass(el, className) {
  if (el) {    
    if (className) {
      el.classList.add(className);
    } else {
      el.classList.remove('far-past');
      el.classList.remove('past');
      el.classList.remove('current');
      el.classList.remove('next');
      el.classList.remove('far-next');      
    }
  }
}

function updateSlideClasses() {
  for (var i = 0, el; el = slideEls[i]; i++) {
    updateSlideClass(el);
  }
  
  updateSlideClass(slideEls[curSlide - 2], 'far-past');
  updateSlideClass(slideEls[curSlide - 1], 'past');

  triggerLeaveEvent(slideEls[curSlide - 1], curSlide - 1);

  updateSlideClass(slideEls[curSlide], 'current');

  triggerEnterEvent(slideEls[curSlide], curSlide);

  updateSlideClass(slideEls[curSlide + 1], 'next');
  updateSlideClass(slideEls[curSlide + 2], 'far-next');

  window.setTimeout(function() {
    // Hide after the slide
    disableFramesForSlide(slideEls[curSlide - 2]);
  }, 301);

  enableFramesForSlide(slideEls[curSlide - 1]);
  enableFramesForSlide(slideEls[curSlide + 2]);

  updateHash();
}

function buildNextItem() {
  var toBuild  = slideEls[curSlide].querySelectorAll('.to-build');

  if (!toBuild.length) {
    return false;
  }

  toBuild[0].classList.remove('to-build', '');

  return true;
}

function prevSlide() {
  if (curSlide > 0) {
    curSlide--;

    updateSlideClasses();
  }
}

function nextSlide() {
  if (buildNextItem()) {
    return;
  }

  if (curSlide < slideEls.length - 1) {
    curSlide++;

    updateSlideClasses();
  }
}

function addPrettify() {
  var els = document.querySelectorAll('pre');
  for (var i = 0, el; el = els[i]; i++) {
    if (!el.classList.contains('noprettyprint')) {
      el.classList.add('prettyprint');
    }
  }
  
  var el = document.createElement('script');
  el.type = 'text/javascript';
  el.src = PERMANENT_URL_PREFIX + 'prettify.js';
  el.onload = function() {
    prettyPrint();
  }
  document.body.appendChild(el);
}

function addFontStyle() {
  var el = document.createElement('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = 'http://fonts.googleapis.com/css?family=Open+Sans:regular,semibold,italic,italicsemibold|Droid+Sans+Mono';

  document.body.appendChild(el);
}

function addGeneralStyle() {
  var el = document.createElement('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = PERMANENT_URL_PREFIX + 'styles.css';

  document.body.appendChild(el);
}

function disableFramesForSlide(slide) {
  if (!slide) {
    return;
  }

  var frames = slide.getElementsByTagName('iframe');
  for (var i = 0, frame; frame = frames[i]; i++) {
    disableFrame(frame);
  }

}

function enableFramesForSlide(slide) {
  if (!slide) {
    return;
  }

  var frames = slide.getElementsByTagName('iframe');
  for (var i = 0, frame; frame = frames[i]; i++) {
    enableFrame(frame);
  }
}

function disableFrame(frame) {
  frame.src = 'about:blank';
}

function enableFrame(frame) {
  var src = frame._src;

  if (frame.src != src && src != 'about:blank') {
    frame.src = src;
  }
}

function setupFrames() {
  var frames = document.querySelectorAll('iframe');
  for (var i = 0, frame; frame = frames[i]; i++) {
    frame._src = frame.src;
    disableFrame(frame);
  }
}

function makeBuildLists() {
  for (var i = curSlide, slide; slide = slideEls[i]; i++) {
    var items = slide.querySelectorAll('.build > *');
    for (var j = 0, item; item = items[j]; j++) {
      if (item.classList) {
        item.classList.add('to-build');
      }
    }
  }
}

function handleDomLoaded() {
  slideEls = document.querySelectorAll('section.slides > article');

  setupFrames();
  makeBuildLists();

  addFontStyle();
  addGeneralStyle();
  addPrettify();

  document.body.classList.add('loaded');

  updateSlideClasses();

  enableFramesForSlide(slideEls[curSlide + 2]);
  enableFramesForSlide(slideEls[curSlide]);
  enableFramesForSlide(slideEls[curSlide + 1]);

  document.body.addEventListener('keydown', handleBodyKeyDown, false);
}

function initialize() {
  getCurSlideFromHash();

  document.addEventListener('DOMContentLoaded', handleDomLoaded, false);
}

initialize();
