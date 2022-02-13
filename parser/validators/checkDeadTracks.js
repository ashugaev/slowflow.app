const get = require('lodash/get');
const axios = require('axios');
const log4js = require('log4js');
const db = require('../../server/schema/schema');

const logger = log4js.getLogger();
logger.level = 'debug';

/**
 * Проверяет, что трек еще жив
 */
module.exports.checkTracksIsNotDead = ({track, _id}) => {
    return new Promise(async (rs, rj) => {
        const thumbnailUrl = get(track, 'snippet.thumbnails.medium.url');

        if (track._lastDeadCheckedAt) {
            const checkedDaysAgo = (new Date().getTime() - track._lastDeadCheckedAt) / 86400000;
            logger.info('Track was last checked', checkedDaysAgo, 'days ago');
        }

        try {
            try {
                await axios.get(thumbnailUrl)
                logger.debug('Image is Valid', thumbnailUrl);
            } catch (e) {
                const {response} = e;

                if (response?.status === 404) {
                    await db.Tracks.deleteOne({_id});
                    logger.error(`Dead Track Was Removed :( ${thumbnailUrl}`);

                    rs();
                    return;
                }

                logger.debug('Fetch image error', thumbnailUrl);
            }

            // Ставим метку о проверке
            await db.Tracks.updateOne({_id}, {
                $set: {
                    _lastDeadCheckedAt: new Date().getTime(),
                }
            })

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
