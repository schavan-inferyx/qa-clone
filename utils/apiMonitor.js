function monitorApiResponseTime(page) {
  const requests = [];

  page.on("request", request => {
    request.startTime = Date.now();
  });

  page.on("response", async response => {
    const req = response.request();
    if (req.startTime) {
      const duration = Date.now() - req.startTime;
      requests.push({
        url: req.url(),
        method: req.method(),
        status: response.status(),
        duration
      });
    }
  });

  return {
    getRequests: () => requests,
    logRequests: () => {
      console.log("📊 API Response Times:");
      requests.forEach(r => {
        const statusEmoji = r.status >= 200 && r.status < 300 ? "✅" : "❌";
        // console.log(
        //   `${statusEmoji} ${r.method} ${r.url} [${r.status}] - ${r.duration} ms`
        // );
      });
    }
  };
}

module.exports = { monitorApiResponseTime };
