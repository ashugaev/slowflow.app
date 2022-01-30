const get = require('lodash/get');
const axios = require('axios');
const log4js = require('log4js');
const db = require('../../server/schema/schema');

const logger = log4js.getLogger();
logger.level = 'debug';

/**
 * Проверяет, что трек еще жив
 */
module.exports.checkTracksIsNotDead = ({ track, _id }) => {
  return new Promise(async (rs, rj) => {
    const thumbnailUrl = get(track, 'snippet.thumbnails.medium.url');

    try {
      try {
        await axios.get(thumbnailUrl)
      } catch (e) {
        // FIXME: Тут должна быть именно ошибка об отсутствующей картинке, а не таймаут или пр дерьмо
        await db.Tracks.deleteOne({_id});

        rj(`Dead Track Was Removed :( ${thumbnailUrl}`);

        return;
      }

      // Ставим метку о проверке
      await db.Tracks.updateOne({ _id }, {
        $set: {
          _lastLiveCheckedAt: new Date().getTime(),
        }
      })

      logger.debug('Image is Valid', thumbnailUrl);

      rs();
    } catch (e) {
      logger.error('Неизвестная ошибка при проверке статуса трека', e);

      rj(`Неизвестная ошибка при проверке статуса трека ${thumbnailUrl}`);
    }
  });
};

/*
(async () => {
  try {
    await tracksIterator([checkTracksIsNotDead]);
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit();
  }
})();
 */
