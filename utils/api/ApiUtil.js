export class ApiUtil {

  constructor(request) {
    this.request = request;
  }

  async getOneByUuidAndVersion({ uuid, type, version = "", action = "view" }) {

    const response = await this.request.get(
      "/common/getOneByUuidAndVersion",
      {
        params: { uuid, type, version, action }
      }
    );

    if (!response.ok()) {
      throw new Error(
        `API failed | uuid=${uuid} | type=${type} | status=${response.status()}`
      );
    }

    return await response.json();
  }
}