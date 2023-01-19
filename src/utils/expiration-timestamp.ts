export const expirationTimestamp = () => {
  const currentTimestamp = new Date();
  Math.floor(
    currentTimestamp.setFullYear(currentTimestamp.getFullYear() + 20) /
      3600 /
      1000
  );
};
