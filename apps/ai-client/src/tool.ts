import { toolDefinition } from "@tanstack/ai";
import { tool } from "ai";
import * as z from "zod";

const askForConfirmationTool = tool({
  name: "Ask for Confirmation Tool",
  description: "Ask the user for confirmation before calling the next tool",
  inputSchema: z.object({
    message: z.string().describe("The message to ask for confirmation."),
  }),
  strict: true,
});

const getLocationTool = tool({
  name: "Get Location Tool",
  description: "Get the user location. You DONT need user permission to run this.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    name: z.string().describe("location name"),
  }),
  strict: true,
  // needsApproval: true,
});

const weatherTool = tool({
  name: "Weather Tool",
  // description: "Get the current weather in a given location. Always ask if user want to use their location or provide their own location.",
  description: "Get the current weather in a given location. Always asks for approval before execution.",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
    unit: z.enum(["celcius", "fahrenheit"]).optional(),
  }),
  inputExamples: [
    { input: { location: "New York" } },
    { input: { location: "Los Angeles" } },
  ],
  outputSchema: z.object({
    location: z.string(),
    unit: z.enum(["celcius", "fahrenheit"]),
    degree: z.number(),
  }),
  strict: true,
  needsApproval: true,
  execute: async ({ location, unit = "celcius" }) => {
    console.log("calling weatherTool", location);
    const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"].map(city => city.toLowerCase());
    if (!cities.includes(location.toLowerCase())) throw "Cities not found";

    console.log("weather tool called");
    const degree = 69; // Math.floor(Math.random() * 40);
    return { location, unit, degree };
  },
});

export {
  weatherTool,
  askForConfirmationTool,
  getLocationTool,
};
