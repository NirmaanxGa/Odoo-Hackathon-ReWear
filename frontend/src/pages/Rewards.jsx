import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { useUserContext } from "../context/UserContext";
import { rewardsItems } from "../assets/data";
import { toast } from "react-toastify";

const Rewards = () => {
  const { isSignedIn } = useAuth();
  const { pointsBalance, redeemReward } = useUserContext();

  const handleRedeem = (reward) => {
    if (!isSignedIn) {
      toast.error("Please sign in to redeem rewards");
      return;
    }

    if (pointsBalance < reward.pointsRequired) {
      toast.error(
        `Insufficient points. You need ${reward.pointsRequired} points.`
      );
      return;
    }

    const success = redeemReward(reward);
    if (success) {
      toast.success(`${reward.title} redeemed successfully!`);
    } else {
      toast.error("Redemption failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            FOREVER Rewards
          </h1>
          <p className="text-gray-600">
            Redeem your points for exclusive FOREVER merchandise
          </p>
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <p className="text-lg font-medium">
              Your Points Balance:{" "}
              <span className="text-green-600">{pointsBalance} points</span>
            </p>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewardsItems.map((reward) => (
            <div key={reward.id} className="border border-gray-200 bg-white">
              <div className="p-6">
                <div className="w-full h-48 bg-gray-100 mb-4 flex items-center justify-center">
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {reward.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  {reward.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {reward.category}
                  </span>
                  <span className="text-lg font-medium text-gray-900">
                    {reward.pointsRequired} pts
                  </span>
                </div>

                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={
                    pointsBalance < reward.pointsRequired || !reward.inStock
                  }
                  className={`w-full py-2 px-4 text-sm font-medium transition-colors ${
                    pointsBalance >= reward.pointsRequired && reward.inStock
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {!reward.inStock
                    ? "OUT OF STOCK"
                    : pointsBalance >= reward.pointsRequired
                    ? "REDEEM NOW"
                    : `NEED ${
                        reward.pointsRequired - pointsBalance
                      } MORE POINTS`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How to Earn Points */}
        <div className="mt-12 bg-gray-50 p-8 rounded">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            How to Earn Points
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Purchase Items</h3>
                <p className="text-sm text-gray-600">
                  Earn 200 points for every item you purchase through the
                  platform
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Upload Quality Items
                </h3>
                <p className="text-sm text-gray-600">
                  Bonus points for uploading high-quality, popular items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
