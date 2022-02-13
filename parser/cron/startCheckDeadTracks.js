const { checkTracksIsNotDead } = require('../validators/checkDeadTracks');
const { startCronJob } = require('../helpers/startCronJob');
const { tracksIterator } = require('../helpers/tracksIterator.js');

startCronJob({
  name: 'Check dead track',
  callback: tracksIterator,
  callbackArgs: [[checkTracksIsNotDead],{sortBy: '_lastDeadCheckedAt', maxIterations: 3000}],
  // Каждые два часа
  period: '0 */2 * * *',
  executeBeforeInit: true,
});
