import * as React from 'react';

function ControlPanel(props) {
  const {time} = props;

  return (
    <div className="control-panel">
      <h3>Interactive GeoJSON</h3>
      <p>
        Map showing the relative capicty load of Harvard buildings at time <b>{time}</b>. Hover over a building to
        see details.
      </p>
      <hr />

      <div key={'year'} className="input">
        <label>Time</label>
        <input
          type="range"
          value={time}
          min={900}
          max={1800}
          step={100}
          onChange={evt => props.onChange(evt.target.value)}
        />
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);