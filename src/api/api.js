import axios from "axios";

const BASE_URL = process.env.API_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class SurveyGenieApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    //pass authorization token in the header.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${SurveyGenieApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      const status = err.response ? err.response.status : 500;
      const message =
        err.response?.data?.error?.message || "An unknown error occurred";
      const error = new Error(message);
      error.response = { status };
      throw err;
    }
  }

  // Individual API routes

  /**Gets a list of surveys (filtered by a user) */
  static async getAllSurveys(user_id) {
    try {
      const response = await this.request(`survey/${user_id}/all`);
      return response.surveys;
    } catch (err) {
      throw err;
    }
  }

  /** Get an individual survey */
  static async getSurvey(user_id, survey_id) {
    let res = await this.request(`survey/${user_id}/${survey_id}`);
    return res.survey;
  }

  /**Create a new survey (filtered by a user) */
  static async createSurvey(user_id, survey_data) {
    let res = await this.request(`survey/${user_id}`, survey_data, "post");
    return res.survey;
  }

  /** Delete a selected survey*/
  static async deleteSurvey(user_id, survey_id) {
    await this.request(`survey/${user_id}/${survey_id}`, {}, "delete");
  }

  /** Complete a survey and store responses*/
  static async completeSurvey(response_data) {
    await this.request("survey/complete", response_data, "post");
  }

  /** Get all responses for one survey*/
  static async getSurveyReponses(survey_id) {
    let res = await this.request(`response/summary/${survey_id}`);
    return res.responses;
  }

  /** Get a response data for chart*/
  static async getResponseData(survey_id) {
    let res = await this.request(`response/data/${survey_id}`);
    return res.surveyChartData;
  }

  /** Get a single response*/
  static async getSingleResponse(response_id) {
    let res = await this.request(`response/${response_id}`);
    return res.response;
  }

  static async getCurrentUser(user_id) {
    let res = await this.request(`user/${user_id}`);
    return res.user;
  }

  static async updateUser(user_id, user_data) {
    let res = await this.request(`user/${user_id}`, user_data, "patch");
    return res.user;
  }

  /** Sign up a new user and return a token*/
  static async signup(userData) {
    let res = await this.request(`auth/register`, userData, "post");
    return res.token;
  }

  /** Log in an existing user and return a token */
  static async login(userData) {
    let res = await this.request(`auth/token`, userData, "post");
    return res.token;
  }
}
export default SurveyGenieApi;
