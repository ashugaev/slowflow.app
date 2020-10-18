import React from 'react';
import { observer, inject } from 'mobx-react';
import j from 'join';
import cnByModifiers from 'cnByModifiers';
import s from './TimeLine.sass';

const TimeLine = inject('playerStore', 'tracksStore')(observer(({
  className, playerStore, tracksStore,
}) => {
  const { getPercent, setByPercent } = playerStore;
  const { track } = tracksStore;
  const { isLive } = track;

  function onClick(e) {
    if (isLive) return;

    const { offsetX, target } = e.nativeEvent;

    // Не совсем корректно брать из target ширину, потому что может быть клик по вложенному эелментуы и там др ширина
    const newPercent = offsetX / target.offsetWidth * 100;

    setByPercent(newPercent);
  }

  const modifiers = cnByModifiers({
    s,
    root: 'TimeLine',
    mods: { deactivated: isLive },
  });

  return (
    <div className={j(s.TimeLine, ...modifiers, className)} onClick={onClick}>
      <div style={{ width: `${isLive ? 100 : getPercent}%` }} className={s.Current} />
    </div>
  );
}));

export default TimeLine;
