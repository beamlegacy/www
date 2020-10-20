module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: {
        title: "Beam",
        description:
          "A new way to collect your thoughts and experience the internet. Coming soon to your Mac.",
        paperdescription:
        "We’re building beam because we think something is fundamentally broken in the way the tools at our disposal have us use the web",
        url: "https://beamapp.co/",
        twitter: "getonbeam",
        year: new Date().getFullYear(),
      },
    },
  },
};
