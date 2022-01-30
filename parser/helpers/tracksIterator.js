const log4js = require('log4js');
const get = require('lodash/get');
const getTracks = require('../../server/controllers/utils/getTracksFromDB');
const { wait } = require('./wait');
const db = require('../../server/schema/schema');

const logger = log4js.getLogger();
logger.level = 'debug';

// TODO: Вконце валидация каналов и удаление каналов, если пустые

/**
 * Просто проходится по трекам из базы
 *
 * INFO: Треков на начало 2022 больше 45000
 * */
const tracksIterator = (callbackList, filters = {}) => {
  return new Promise(async (rs, rj) => {
    let lastFetchedTracks = [];
    let lastTrackId;
    let counter = 0;

    const {sortBy, liveOnly} = filters

    const sortByLastLiveCheckedAt = sortBy === '_lastLiveCheckedAt'

    do {
      try {
        // Сутки
        const secondsAgo = 72000;

        const dateToCheck = new Date(new Date().getTime() - secondsAgo * 1000);

        let findParams = {};
        const sortParams = {};

        lastTrackId && (findParams._id = { $gt: lastTrackId });
        (liveOnly === true) && (findParams['snippet.liveBroadcastContent'] = 'live');
        // Должны быть сверху старые даты и пустые поля
        // Перетрет findParams
        sortByLastLiveCheckedAt && (findParams =  {
          $or: [
              // TODO: Протестить условие
            { _lastLiveCheckedAt: null },
            { _lastLiveCheckedAt: { $lte: dateToCheck } }
          ]
        })

        const lastFetchedTracks = await db.Tracks.find(findParams).limit(50).sort(sortParams).lean();

        debugger
      } catch (e) {
        rj(e);
        continue;
      }

      const tracksLength = lastFetchedTracks.length;

      if (!tracksLength) {
        rs();
        return;
      }

      lastTrackId = lastFetchedTracks[tracksLength - 1]._id.toString();

      for (let i = 0; i < tracksLength; i++) {
        const track = lastFetchedTracks[i];

        logger.info(`Track number ${counter}`);
        counter++;

        for (let j = 0; j < callbackList.length; j++) {
          await wait(0, 100);

          try {
            const trackJSON = JSON.parse(JSON.stringify(track));
            const videoId = get(trackJSON, 'id.videoId');
            const { _id } = track;

            await callbackList[j]({
              track,
              videoId,
              _id,
            });
          } catch (e) {
            logger.error(e);

            continue;
          }
        }
      }
    } while (lastFetchedTracks.length);

    logger.debug('READY!');

    rs();
  });
};

module.exports = {
  tracksIterator,
};
