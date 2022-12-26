/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  ChatBubbleBottomCenterIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Clock from "react-digital-clock";
import CompleteReportChart from "./completeReportChart";
import TaskChart from "./taskChart";
import { useSelector } from "react-redux";

export default function Dashboards() {
  const [reports, setReport] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState([]);
  const [value, onChange] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    getReports();
    getMeetings();
    getTasks();
    getUsers();
  }, []);

  //User
  const { user } = useSelector((state) => state.auth);

  //GO TO

  const gotoReport = async () => {
    let path = "/dashboard/report";
    navigate(path);
  };

  const gotoTask = async () => {
    let path = "/dashboard/task";
    navigate(path);
  };

  const gotoMeeting = async () => {
    let path = "/dashboard/meeting";
    navigate(path);
  };

  const gotoUser = async () => {
    let path = "/dashboard/user";
    navigate(path);
  };

  // GET & POST

  const getReports = async () => {
    const response = await axios.get("http://localhost:5000/report");
    setReport(response.data);
  };
  const getUsers = async () => {
    const response = await axios.get("http://localhost:5000/user");
    setUsers(response.data);
  };

  const getMeetings = async () => {
    const response = await axios.get("http://localhost:5000/meeting");
    setMeetings(response.data);
  };

  const getTasks = async () => {
    const response = await axios.get("http://localhost:5000/task");
    setTask(response.data);
  };

  const updateStatus = async (id) => {
    await axios.patch(`http://localhost:5000/task/${id}`, {
      status: "Completed",
    });
    window.alert("Task Updated Successfully");
    getTasks();
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  return (
    <section>
      <div className="flex sm:flex-row flex-col gap-5 py-8">
        <div className="flex flex-col w-full">
          <div className="flex md:flex-row flex-col bg-slate-500 p-4 bg-opacity-10 rounded-lg">
            <div className="flex md:flex-row flex-col items-center justify-center w-full px-5 text-xl text-white">
              Welcome Back{" "}
              <span className="text-sky-300"> , {user && user.name} !</span>
            </div>
            <div className="w-full flex md:flex-row gap-5">
              <a
                onClick={gotoReport}
                className="flex flex-col gap-2 px-5 w-1/3 mt-5 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-bold">
                <ChartBarIcon className="w-10 h-10" />
                <span>Reports Total</span>
                <span className="font-black">{reports.length}</span>
                <EllipsisHorizontalIcon className=" w-5 h-5" />
              </a>
              <a
                onClick={gotoTask}
                className="flex flex-col gap-2 px-5 w-1/3 mt-5 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-white font-bold">
                <DocumentCheckIcon className="w-10 h-10" />
                <span>Tasks Total</span>
                <span className="font-black">{task.length}</span>
                <EllipsisHorizontalIcon className=" w-5 h-5" />
              </a>
              <a
                onClick={gotoMeeting}
                className="flex flex-col gap-2 px-5 w-1/3 mt-5 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white font-bold">
                <UserGroupIcon className="w-10 h-10" />
                <span>Meeting Total</span>
                <span className="font-black">{meetings.length}</span>
                <EllipsisHorizontalIcon className=" w-5 h-5" />
              </a>
              {user && user.roles === "admin" && (
                <a
                  onClick={gotoUser}
                  className="flex flex-col gap-2 px-5 w-1/3 mt-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold">
                  <UserGroupIcon className="w-10 h-10" />
                  <span>User Total</span>
                  <span className="font-black">{users.length}</span>
                  <EllipsisHorizontalIcon className=" w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-5 md:flex-row flex-col justify-center items-center pt-10">
            {/* Right Side */}
            <div className="flex flex-col items-center w-9/12 bg-sky-900 bg-opacity-20 p-5 rounded-xl">
              <span className="py-5 text-white font-bold text-lg">Reports</span>
              <div className="sm:mr-14 mr-0">
                <CompleteReportChart />
              </div>
            </div>
            {/* Left Side */}
            <div className="flex flex-col items-center w-9/12 bg-sky-900 bg-opacity-20 p-5 rounded-xl">
              <span className="py-5 text-white font-bold text-lg">Tasks</span>
              <TaskChart />
            </div>
          </div>

          {/* Reports Table */}
          <table className="table-compact w-full bg-slate-800 rounded-2xl text-white mt-7">
            <thead>
              <tr>
                <th>ID</th>
                <th>Promote Name</th>
                <th>Promote PIC</th>
                <th>Changes</th>
                <th>Promote Date</th>
                <th className="sm:block hidden">Side Promote</th>
              </tr>
            </thead>
            <tbody>
              {reports
                .filter(
                  (report) => report.promote_status == "In Progress" && "N/A"
                )
                .sort((a, b) => (a.promote_date < b.promote_date ? 1 : -1))
                .slice(0, 10)
                .map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.promote_name}</td>
                    <td>{report.promote_pic}</td>
                    <td>{report.changes}</td>
                    <td>{report.promote_date}</td>
                    <td className="sm:block hidden">{report.side_promote}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Calendar & Clock */}
        <div className="flex flex-col items-center h-fit px-5 sm:w-1/4 w-full bg-slate-800 rounded-xl py-2">
          <span className="flex flex-row mt-3">
            Time :<Clock />
          </span>
          <div className="divider" />
          <span className="text-lg text-white ">Calendar</span>
          <Calendar
            className="rounded-xl mt-3 bg-sky-900 border-none bg-opacity-10 mb-3"
            calendarType="US"
            onChange={onChange}
            value={value}
          />
          <div className="divider" />

          {/* Up Coming Meetings */}
          <span className="text-lg text-white pb-2">Up Coming Meetings</span>
          <table className="table-compact table-zebra w-full bg-slate-800 rounded-2xl text-white">
            <thead>
              <tr>
                <th>Meeting</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {meetings
                .filter(
                  (meeting) => meeting.meeting_date >= formatDate(Date.now())
                ) // Filter out meetings with a date that is less than or equal to the current date
                .sort((a, b) => (a.meeting_date < b.meeting_date ? 1 : -1))
                .slice(0, 3)
                .map((meeting, index) => (
                  <tr key={meeting.meeting_date}>
                    <td>{meeting.meeting_name}</td>
                    <td>{meeting.meeting_date}</td>
                    <td>
                      <a
                        href={meeting.online_meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-row gap-2 bg-blue-500 p-2 rounded-lg text-white">
                        <ChatBubbleBottomCenterIcon className="w-5 h-5" />
                        Join
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="divider" />

          {/* Task List */}

          <span className="text-lg text-white pb-2">Task List</span>
          <table className="table-compact table-zebra w-full bg-slate-800 rounded-2xl text-white">
            <thead>
              <tr>
                <th>Task</th>
                <th>Deadline</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {task
                .filter((task) => task.status === "Uncompleted")
                .sort((a, b) => (a.deadline < b.deadline ? 1 : -1))
                .slice(0, 5)
                .map((singletask) => (
                  <tr key={singletask.id}>
                    {/* <td>{truncate(meeting.meeting_name)}</td> */}
                    <td>{singletask.name}</td>
                    <td>{singletask.deadline}</td>
                    <td>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you wish to update this task?"
                            )
                          )
                            updateStatus(singletask.id);
                        }}
                        className="flex flex-row gap-2 bg-green-600 p-2 rounded-lg text-white">
                        <CheckCircleIcon className="w-5 h-5" />
                        Done
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
