import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CircleUser } from "lucide-react";
import { fetchUsers } from "../store/user-slice.jsx";
import { updatePoints } from "../store/user-slice";
const Ranking = () => {
  const { users } = useSelector((state) => state.user);
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const { dailyTask } = useSelector((state) => state.task);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    if (dailyTask && loggedInUser) {
      dailyTask.forEach((task) => {
        if (!task.pointsAwarded) {
          if (task.isCompleted) {
            dispatch(
              updatePoints({
                userId: loggedInUser._id,
                completed: true,
                taskId: task._id,
              })
            );
          } else if (task.hasExceededTime) {
            dispatch(
              updatePoints({
                userId: loggedInUser._id,
                completed: false,
                taskId: task._id,
              })
            );
          }
        }
      });
    }
  }, [dailyTask]);

  return (
    <div className="bg-gray-100 p-6 lg:min-h-screen flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Power Rankings
        </h1>
        <h1 className="text-4xl font-bold text-purple-800 mb-6">Sowalnk</h1>
      </div>
      <div className="overflow-auto w-full  h-96 max-w-4xl rounded-lg shadow-md">
        <table className="w-full text-left overflow-auto  border-collapse bg-white rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Position</th>
              <th className="p-3">Name</th>
              <th className="p-3">Positive Points</th>
              <th className="p-3">Negative Points</th>
              <th className="p-3">Total Points</th>
              <th className="p-3">Streak</th>
            </tr>
          </thead>
          <tbody>
            {users.map((person, index) => (
              <tr
                key={index}
                className={`${
                  person._id === loggedInUser?._id
                    ? "bg-blue-200" // Highlight current user
                    : index % 2 === 0
                    ? "bg-gray-100"
                    : "bg-gray-200"
                } hover:bg-blue-100`}
              >
                <td className="p-3 pl-7 font-bold">{index + 1}</td>
                <td className="p-3">
                  <div className="flex gap-3 items-center">
                    <CircleUser className="w-6 h-6 inline-block" />
                    {person.name}
                  </div>
                </td>
                <td className="p-3 text-green-600">
                  +{person?.positivePoints}
                </td>
                <td className="p-3 text-red-600">-{person?.negativePoints}</td>
                <td className="p-3 font-bold">{person?.totalPoints}</td>
                <td className="p-3">
                  {person.streak > 0 && (
                    <div className="flex items-center">
                      <span className="text-yellow-600">🔥</span>
                      <span className="ml-1 font-semibold">
                        {person.streak} day{person.streak !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Current User Stats Card */}
      {/* {users && (
        <div className="mt-6 w-full max-w-2xl bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold text-blue-600 mb-2">Your Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Position</div>
              <div className="text-xl font-bold text-blue-600">
                #{users.find((u) => u._id === users._id)?.position || "-"}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Positive Points</div>
              <div className="text-xl font-bold text-green-600">
                +{users.find((u) => u._id === users._id)?.positivePoints || 0}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Negative Points</div>
              <div className="text-xl font-bold text-red-600">
                -{users.find((u) => u._id === users._id)?.negativePoints || 0}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="text-xl font-bold text-yellow-600">
                {users.find((u) => u._id === users._id)?.streak || 0} days
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Ranking;
