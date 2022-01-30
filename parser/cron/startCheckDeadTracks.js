const { checkTracksIsNotDead } = require('../validators/checkDeadTracks');
const { startCronJob } = require('../helpers/startCronJob');
const { tracksIterator } = require('../helpers/tracksIterator.js');

// TODO: Стартанется ли джоба, если она еще не завершилась
startCronJob({
  name: 'Check dead track',
  callback: tracksIterator,
  callbackArgs: [[checkTracksIsNotDead, {sortBy: '_lastLiveCheckedAt'}]],
  // TODO: СДЕЛАТЬ ЧАЩЕ
  // раз в два дня в 18 часов
  period: '0 18 */2 * *',
  executeBeforeInit: true,
});
