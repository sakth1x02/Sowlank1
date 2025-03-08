import { FaTasks, FaBell, FaChartLine, FaTachometerAlt, FaCogs, FaGift } from "react-icons/fa";

const Feature = () => {
  const features = [
    {
      icon: <FaTasks className="text-4xl text-violet-500 mb-4" />,
      title: "Task Completion",
      description: "Easily add, edit, and organize tasks",
    },
    {
      icon: <FaBell className="text-4xl text-violet-500 mb-4" />,
      title: "Reminders & Due Dates",
      description: "Set deadlines and get notifications",
    },
    {
      icon: <FaChartLine className="text-4xl center text-violet-500 mb-4" />,
      title: "Progress Tracking",
      description: "Monitor task completion and stay on top of your goals",
    },
    {
      icon: <FaTachometerAlt className="text-4xl center text-violet-500 mb-4" />,
      title: "Analytics Dashboard",
      description: "Gain insights into your productivity patterns",
    },
    {
      icon: <FaCogs className="text-4xl text-violet-500 mb-4" />,
      title: "Personalization",
      description: "Customize themes and layouts to suit your style",
    },
    {
      icon: <FaGift className="text-4xl text-violet-500 mb-4" />,
      title: "Exclusive Rewards",
      description: "Earn discounts on premium items as you complete tasks",
    },
  ];

  return (
    <section className="bg-violet-200 py-16" id="features">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Features of Sowalnk
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-lg rounded-lg text-center hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-center items-center mb-4">
                {feature.icon}
               </div>

              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
