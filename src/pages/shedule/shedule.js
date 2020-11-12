import React from "react";
import Table from "~c/table";
import Datepick from "~c/datepick";

function Shedule(props) {
  return (
    <React.Fragment>
      <h2>Расписание:</h2>
      <Datepick />
      <Table />
    </React.Fragment>
  );
}

export default Shedule;
