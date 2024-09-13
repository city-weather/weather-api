const request = require('supertest');
const app = require('../wapi');
let server;

describe('GET /getWeather', () => {


  test('should respond with weather data for a valid city', async () => {
    const cityName = 'Delhi';
    const response = await request(app).get(`/getWeather?param=${cityName}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('main');
    expect(response.body).toHaveProperty('weather');
    // Add more assertions as needed
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });
  
});
