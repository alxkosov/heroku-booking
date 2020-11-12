import React from "react";
import "antd/dist/antd.css";
import { DatePicker, Select } from "antd";
import withStore from "~/hocs/withStore";
const { Option } = Select;
import moment from "moment";

const dateFormat = "DD/MM/YYYY";

function Datepick(props) {
  moment.locale("ru");

  const handleChangeStartDate = function (e) {
    props.stores.admin.setStartDate(e);
  };
  const handleChangeInterval = function (e) {
    props.stores.admin.setCalendarInterval(e);
  };

  const disabledDate = function (current) {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };

  return (
    <React.Fragment>
      <DatePicker
        defaultValue={moment(props.stores.admin.startDate, dateFormat)}
        // disabledDate={disabledDate}  //!можно смотреть даты в прошлом в таблице!
        onChange={handleChangeStartDate}
        format={dateFormat}
        allowClear={false}
      />
      <Select
        defaultValue={props.stores.admin.calendarInterval}
        style={{ width: 120 }}
        onChange={handleChangeInterval}
      >
        <Option value="30">30 дней</Option>
        <Option value="45">45 дней</Option>
        <Option value="60">60 дней</Option>
        <Option value="90">90 дней</Option>
      </Select>
    </React.Fragment>
  );
}
//export default Datepick;
export default withStore(Datepick);
