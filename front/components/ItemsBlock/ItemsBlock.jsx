import React from 'react';
import get from 'lodash-es/get';
import Text from 'c/Text';
import Loader from 'c/Loader';
import LazyLoader from 'c/LazyLoader';
import { inject, observer } from 'mobx-react';
import Items from 'c/ItemsBlock/Items';
import { tracksType } from 'helpers/constants';
import s from './ItemsBlock.sass';

const ItemsBlock = inject('pageStore', 'channelsStore')(observer(({
  pageStore, type, title, channelsStore, titlePlaceholder,
}) => {
  const {
    isTracksLoading, noTracksToFetch, fetchPageTracks,
  } = pageStore;
  const { noChannelsToFetch } = channelsStore;

  function loadMoreItems() {
    fetchPageTracks({
      afterObjId: get(pageStore, 'lastTrack._id'),
    });
  }

  return (
    <>
      {type === tracksType && (
        <LazyLoader
          loadHandler={loadMoreItems}
          pixelsLeftToLoad={600}
          skipLoads={isTracksLoading || noTracksToFetch}
        />
      )}
      <div className={s.ItemsBlock}>
        {(title || titlePlaceholder) ? (
          <Text
            text={title || '...'}
            size="xl"
            className={s.Title}
            line="normal"
            bold
            cropLine
          />
        ) : <div className={s.UpperPlaceholder} />}
        <div className={s.List}>
          <Items type={type} />
        </div>
      </div>
      {((!noTracksToFetch && type === tracksType) || (!noChannelsToFetch && type === 'channels'))
        ? <Loader />
        : <div className={s.BottomPlaceholder} />}
    </>
  );
}));

export default ItemsBlock;
