// Import stylesheets
import './style.css';

// Write Javascript code!
/* eslint-disable no-console */
('use strict');
const { gsap } = require('gsap');
const { ScrollTrigger } = require('gsap/ScrollTrigger');
gsap.registerPlugin(ScrollTrigger);

const productHeroAnimatedSequenceXray = (node) => {
  const canvas = node.querySelector('.js-product-hero-anim-canvas');
  const xrayData = node.querySelector('#xrayData');
  const context = canvas.getContext('2d');
  const textHeading = node.querySelector(
    '.product-hero-anim__text-holder--xray'
  );
  const images = [];
  const product = {
    frame: 0,
  };

  const parseXrayData = JSON.parse(xrayData.getAttribute('data'));

  parseXrayData.imageSequence.forEach((data) => {
    const img = new Image();
    img.src = data.transformBaseUrl;
    images.push(img);
  });

  const el = node.querySelectorAll('.js-item-hotspot');

  const render = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const loaded = images[product.frame];
    const iw = loaded.width;
    const ih = loaded.height;
    const cw = canvas.width;
    const ch = canvas.height;
    const f = Math.max(cw / iw, ch / ih);

    for (const [i, item] of el.entries()) {
      item.style.opacity = '0';
      if (product.frame > parseInt(item.getAttribute('frame-start'), 10)) {
        item.style.opacity = '1';
        el[i >= 1 ? i - 1 : i].style.opacity = '0';
      }
    }

    context.setTransform(
      /*     scale x */ f,
      /*      skew x */ 0,
      /*      skew y */ 0,
      /*     scale y */ f,
      /* translate x */ (cw - f * iw) / 2,
      /* translate y */ (ch - f * ih) / 2
    );

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(loaded, 0, 0);
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: node,
      start: 'top top',
      end: '+=200%',
      pin: true,
      markers: true,
    },
  });

  const slideInTween = gsap.fromTo(
    textHeading,
    { x: '0', y: '0' },
    { x: '0', y: '-250%' }
  );

  const animSequenceTween = gsap.to(product, {
    frame: parseXrayData.imageSequence.length - 1,
    snap: 'frame',
    onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
  });

  tl.add(slideInTween).add(animSequenceTween);

  console.log('TEST 8');

  images[0].onload = render;
};

module.exports = productHeroAnimatedSequenceXray;
