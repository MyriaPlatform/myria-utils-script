export const millisecondsToMinutesAndSeconds = (millisecond: number) => {
  var minutes = Math.floor(millisecond / 60000);
  var seconds = Number(((millisecond % 60000) / 1000).toFixed(0));
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};
