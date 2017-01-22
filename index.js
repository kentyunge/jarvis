'use strict'

const Sonus = require('sonus');
const lights = require('./Components/Lights');
const util = require('./Utilities');
const settings = require('./Settings');

const speech = require('@google-cloud/speech')({
  projectId: settings.google.projectId,
  keyFilename: settings.keyFileName
});

const hotwords = [{ file: './jarvis.pmdl', hotword: 'jarvis' }];
const language = "en-US";
const sonus = Sonus.init({ hotwords, language }, speech);
const default_room = 'office';

try {
  Sonus.trigger(sonus, 1)
} catch (e) {
  console.log('Triggering Sonus before starting it will throw the following exception:', e)
}

Sonus.start(sonus)

sonus.on('hotword', (index, keyword) => {
  console.log("Index----->" + index);
  console.log("Keyword--->" + keyword);
}
);

sonus.on('partial-result', result => console.log("Partial---->", result))

sonus.on('error', (error) => console.log(error))

sonus.on('final-result', result => {
  console.log("Final--->", result)
  /*
  if (result.includes("stop")) {
    Sonus.stop()
  }
  */


  /* HANDLE HUES LIGHTS */
  if (result.includes('lights') || result.includes('light') || result.includes('mood')) {

    let room;

    // Determine room
    if (result.includes('in the')) {
      room = result.substring(result.indexOf('in the ') + 7, result.length).toLowerCase();
    }

    room = (room) ? room : default_room;

    if (result.includes('mood to')) {
      console.log('mood');
      const scene = result.substring(result.indexOf('mood to') + 7, result.length);
      lights.scene(room, scene);
    }

    if (result.includes('on')) {
      console.log('turn on');
      lights.on(room);
    }

    if (result.includes('off')) {
      lights.off(room);
    }

    if (result.includes('brighten') || result.includes('brighter')) {
      lights.brighten(room);
    }

    if (result.includes('dim') || result.includes('dimmer')) {
      lights.dim(room);
    }
  }
})

try {
  Sonus.trigger(sonus, 2)
} catch (e) {
  console.log('Triggering Sonus with an invalid index will throw the following error:', e)
}