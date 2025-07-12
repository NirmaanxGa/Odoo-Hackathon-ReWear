import React from "react";

const ImpactSection = () => {
  const impactStats = [
    {
      number: "50K+",
      label: "Items Exchanged",
      description: "Clothing pieces given new life through our platform",
    },
    {
      number: "25K+",
      label: "Community Members",
      description: "Fashion-conscious individuals making a difference",
    },
    {
      number: "75%",
      label: "Waste Reduction",
      description: "Less textile waste compared to traditional shopping",
    },
    {
      number: "100+",
      label: "Cities Covered",
      description: "Growing network across India and beyond",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Our Impact
          </h2>
          <div className="w-24 h-px bg-gray-300 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ReWear is more than just a clothing exchange platform. We're
            building a sustainable fashion ecosystem that reduces waste, saves
            money, and creates meaningful connections between fashion lovers
            worldwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-4xl md:text-5xl font-light text-black mb-4 group-hover:text-gray-700 transition-colors">
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {stat.label}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-light text-gray-900 mb-6">
                Transforming Fashion, One Exchange at a Time
              </h3>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Every item exchanged on ReWear represents a step towards a
                  more sustainable future. By extending the lifecycle of
                  clothing, we're reducing the environmental impact of fast
                  fashion while making quality garments accessible to everyone.
                </p>
                <p className="leading-relaxed">
                  Our community-driven approach ensures that fashion remains
                  circular, creative, and conscious. Together, we're proving
                  that style doesn't have to come at the cost of our planet.
                </p>
              </div>

              {/* Call to Action */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-gray-800 transition-colors">
                  JOIN OUR MISSION
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-3 text-sm font-medium hover:bg-gray-50 transition-colors">
                  LEARN MORE
                </button>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-6 h-32 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-pink-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-6 h-24 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-6 h-24 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-6 h-32 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
