import React, { useState, useEffect } from 'react';
import { cn } from '@bem-react/classname';
import { inject, observer } from 'mobx-react';
import Button from 'c/Button';
import './TagsMenu.sass';

const cnTagsMenu = cn('TagsMenu');

const TagsMenu = inject('tagsStore', 'tracksStore')(observer(({ tagsStore, tracksStore }) => {
  const [isOpened, setIsOpened] = useState(false);

  const { fetchTagsByIds, pushToAllTags, allTags } = tagsStore;
  const { setFilterTags } = tracksStore;

  useEffect(() => {
    fetchTagsByIds(null, pushToAllTags);
  }, []);

  function toggleIsOpened() {
    setIsOpened(!isOpened);
  }

  function onTagClick(args) {
    setFilterTags(args);
    toggleIsOpened();
  }

  return (
    <div className={cnTagsMenu({ isOpened })}>
      <div className={cnTagsMenu('Background')} onClick={toggleIsOpened} />
      <div className={cnTagsMenu('Sideblock')}>
        {allTags.map((tag, i) => (
          <Button onClickArgs={tag._id} onClick={onTagClick} key={i} theme="label" text={tag.name} />
        ))}

        <div className={cnTagsMenu('ToggleButton')} onClick={toggleIsOpened} />
      </div>
    </div>
  );
}));

export default TagsMenu;
