export default async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = 'WO3OFxZcv2dmDxzRbRytePgGmtWsA04U';
  const url = `https://api.solcast.com.au/data/live/radiation_and_weather?latitude=${lat}&longitude=${lon}&hours=168&output_parameters=ghi,dni,air_temp&period=PT30M&format=csv&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const csvData = await response.text();
    const lines = csvData.split('\n');
    let totalRadiation = 0;
    let count = 0;

    lines.forEach(line => {
      const columns = line.split(',');
      if (!isNaN(columns[1])) {
        totalRadiation += parseFloat(columns[1]);
        count++;
      }
    });

    const dailyRadiation = totalRadiation / count;
    const annualRadiation = dailyRadiation * 365;

    res.status(200).json({ annualRadiation });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
