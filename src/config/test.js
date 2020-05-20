const test = () => {
  return {
    env: "test",
    db: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/db",
    jwtSecret:
      process.env.JWT_SECRET ||
      "Q0TwcUP5weaKsWWuE1ahnnWDgiXFsncn3rR3h0NrLwMEYwePwtkJLxkTuhQtm5R",
    port: process.env.PORT || 3000,
  };
};

export default test;
