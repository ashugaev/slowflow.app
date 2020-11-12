import React from 'react';
import TracksListItem from 'c/TracksListItem';
import ChannelListItem from 'c/ChannelListItem';
import GenreItem from 'c/CategoryItem';
import get from 'lodash-es/get';
import { inject, observer } from 'mobx-react';
import { genresType } from 'helpers/constants';


const Items = inject('playerTracksStore', 'channelsStore', 'categoriesStore', 'playerStore', 'pageStore')(observer(({
  categoriesStore, channelsStore, playerTracksStore, playerStore, pageStore, type,
}) => {
  let content = null;

  const { allChannels } = channelsStore;
  const { track } = playerTracksStore;
  const { allCategories } = categoriesStore;
  const { isPlaying } = playerStore;
  const { tracks } = pageStore;

  switch (type) {
    case 'tracks':
      content = tracks.map(({ snippet, id, _id }) => (
        <TracksListItem
          key={_id}
          title={get(snippet, 'title')}
          imageUrl={get(snippet, 'thumbnails.high.url')}
          isPlaying={(id.videoId === get(track, 'id.videoId')) && isPlaying}
          videoObjId={_id}
          isLive={get(snippet, 'liveBroadcastContent') === 'live'}
        />
      ));
      break;

    case 'channels':
      content = allChannels.map(({
        brandingSettings, statistics, snippet, id, _id, bgImage,
      }) => (
        <ChannelListItem
          key={_id}
          id={id}
          title={get(snippet, 'title')}
          logoImageUrl={get(snippet, 'thumbnails.default.url')}
          wrapImageUrl={bgImage || get(brandingSettings, 'image.bannerMobileImageUrl')}
          subscriberCount={get(statistics, 'subscriberCount')}
          viewCount={get(statistics, 'viewCount')}
        />
      ));
      break;

    case genresType:
      content = allCategories.map(({
        _id, name, bgImage, path,
      }) => (
        <GenreItem
          key={_id}
          wrapImageUrl={bgImage}
          title={name}
          path={path}
        />
      ));
      break;

    default:
      break;
  }

  return content;
}));

export default Items;