import React, { useEffect } from "react";
import "antd/dist/antd.css";
import withStore from "~/hocs/withStore";
import { NavLink } from "react-router-dom";
import { urlBuilder } from "~/routes";
import moment from "moment";
import classNames from "classnames";

import E404 from "~c/errors/404";
import { Empty, Spin } from "antd";
import TableRow from "~c/table/tableRow";
import "./table.less";

function Table(props) {
  useEffect(() => {
    const fetchData = async () => {
      await props.stores.admin.fetchAll({ _expand: "type" });
      //await props.stores.admin.fetchAllWithOrders();
    };
    fetchData();
  }, []); /*
Если вы хотите запустить эффект и очистить его только один раз (при монтировании и демонтировании), вы можете передать
пустой массив [] в качестве второго аргумента. Это укажет React, что ваш эффект не зависит от каких-либо значений props или state,
и его не нужно повторно выполнять https://learn-reactjs.ru/core/hooks/effect-hook
*/

  // const showCalendarHeader = (date = moment(), days = 60) => {
  //   let calend = [];
  //   for (let day = 0; day < days; ++day) {
  //     let d = (
  //       <div className="shedule__day" key={day}>
  //         <div className="day">
  //           {moment(date).add(day, "days").format("DD")}
  //           {/* LL   //YYYY MM DD */}
  //         </div>
  //       </div>
  //     );
  //     calend.push(d);
  //   }
  //   return calend;
  // };

  //render() {
  moment.locale("ru");
  let adminModel = props.stores.admin;
  //let rooms = adminModel.compiledData.map((item, i) => {
  let rooms = adminModel.rooms.map((item, i) => {
    return <TableRow row={item} key={item.id} />;
  });

  const makeYearsRow = (date = moment(), days = 60) => {
    let calend = [];
    let span = 1;
    for (let day = 0; day < days; ++day) {
      let month = moment(date).add(day, "days").format("YYYY");
      if (
        day + 1 < days &&
        moment(date).add(day, "days").format("YYYY") ===
          moment(date)
            .add(day + 1, "days")
            .format("YYYY")
      ) {
        span++;
      } else {
        let d = (
          <th className="shedule__day" key={day} colSpan={span}>
            <div className="year-month">
              {moment(date).add(day, "days").format("YYYY")}
            </div>
          </th>
        );
        calend.push(d);
        span = 1;
      }
    }
    return (
      <tr className="shedule__head-row">
        <th className="shedule__head" rowSpan={3}>
          Номера:
        </th>
        {calend.map((item) => {
          return item;
        })}
      </tr>
    );
  };

  const makeMonthsRow = (date = moment(), days = 60) => {
    let calend = [];
    let span = 1;
    for (let day = 0; day < days; ++day) {
      let month = moment(date).add(day, "days").format("MMMM");
      if (
        day + 1 < days &&
        moment(date).add(day, "days").format("MMMM") ===
          moment(date)
            .add(day + 1, "days")
            .format("MMMM")
      ) {
        span++;
      } else {
        let d = (
          <th className="shedule__day" key={day} colSpan={span}>
            <div className="year-month">
              {moment(date).add(day, "days").format("MMMM")}
            </div>
          </th>
        );
        calend.push(d);
        span = 1;
      }
    }
    return (
      <tr className="shedule__head-row">
        {calend.map((item) => {
          return item;
        })}
      </tr>
    );
  };

  const makeDaysRow = (date = moment(), days = 60) => {
    let calend = [];
    for (let day = 0; day < days; ++day) {
      let wd = moment(date).add(day, "days").format("dd");
      let holiday = false;
      if (wd === "сб" || wd === "вс") {
        holiday = true;
      }
      let classes = classNames("shedule__day", holiday ? "holyday" : null);
      let d = (
        <th className={classes} key={day}>
          <div className="day">
            <div>{moment(date).add(day, "days").format("DD")}</div>
            <div>{wd}</div>
          </div>
        </th>
      );
      calend.push(d);
    }
    return (
      <tr className="shedule__head-row">
        {calend.map((item) => {
          return item;
        })}
      </tr>
    );
  };

  return (
    <React.Fragment>
      <div className="shedule-container">
        <table className="shedule">
          <thead>
            {makeYearsRow(
              props.stores.admin.startDate,
              props.stores.admin.calendarInterval
            )}

            {makeMonthsRow(
              props.stores.admin.startDate,
              props.stores.admin.calendarInterval
            )}

            {makeDaysRow(
              props.stores.admin.startDate,
              props.stores.admin.calendarInterval
            )}
          </thead>
          <tbody>
            {adminModel.state == "empty" ? (
              <tr className="centered">
                <td colSpan={60} rowSpan={15}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </td>
              </tr>
            ) : adminModel.state == "done" ? (
              rooms
            ) : adminModel.state == "pending" ? (
              <tr className="centered mh100">
                <td colSpan={60} rowSpan={15}>
                  <Spin />
                </td>
              </tr>
            ) : (
              <E404 />
            )}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
  //}
}
export default withStore(Table);
