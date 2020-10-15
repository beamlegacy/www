module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: {
        title: "Beam",
        description:
          "A new way to collect your thoughts and experience the internet. Coming soon to your Mac.",
        url: "https://beamapp.co/",
        twitter: "getonbeam",
        year: new Date().getFullYear(),
      },
    },
  },
};
