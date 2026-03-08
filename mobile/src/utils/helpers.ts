
export const consoleLog = (data: object) => {
  // Nicely print data objects.
  console.log('LOG: ' + JSON.stringify(data, null, 2));
}
