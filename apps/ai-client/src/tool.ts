import { toolDefinition } from "@tanstack/ai";
import { tool } from "ai";
import * as z from "zod";

const weatherTool = tool({
  name: "Weather Tool",
  description: "Get the current weather in a given location",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
    unit: z.enum(["celcius", "fahrenheit"]).optional(),
  }),
  inputExamples: [
    { input: { location: "San Francisco, CA" } },
    { input: { location: "Boston, MA" } },
  ],
  outputSchema: z.object({
    location: z.string(),
    unit: z.enum(["celcius", "fahrenheit"]),
    degree: z.number(),
  }),
  strict: true,
  execute: async ({ location, unit = "celcius" }) => {
    console.log("calling weatherTool", location);
    const weatherData = {
      "Boston": {
        celcius: "15 celcius",
	fahrenheit: "59 fahrenheit",
      },
      "San Francisco": {
        celcius: "19 celcius",
	fahrenheit: "64 fahrenheit",
      },
    };

    const weather = weatherData[location];
    const degree = Math.floor(Math.random() * 40);
    return { location, unit, degree };
  },
});

export {
  weatherTool,
};
