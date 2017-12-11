/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

(function () {
  const editEvents = [
    "app.record.create.show",
    "mobile.app.record.create.show",
    "app.record.edit.show",
    "mobile.app.record.edit.show",
    "app.record.index.edit.show"
  ];
  kintone.events.on(editEvents, (event: Kintone.RecordEvent): Kintone.RecordEvent => {
    const record = event.record;

    const elm = kintone.app.record.getSpaceElement("space01");
    if (!elm) {
      return event;
    }

    ReactDOM.render(<App />, elm);

    return event;
  });

})();
