import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";

describe("Health API", () => {
  it("should return API health status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "BizFlow API is running",
    });
  });
});
