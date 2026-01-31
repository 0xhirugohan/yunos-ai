import { toolDefinition } from "@tanstack/ai";

const getXAUTPriceInputSchema: JSONSchema = {
  type: "object",
  properties: {
    time: {
      type: "date",
      description: "the time of price being asked, default latest (right now)",
    },
  },
};

const getXAUTPriceOutputSchema: JSONSchema = {
  type: "object",
  properties: {
    price: {
      type: "number",
      description: "the price of XAUT in USD"
    },
  },
  required: ["price"],
};

export const getXAUTPriceDef = toolDefinition({
  name: 'get_XAUTPrice',
  description: 'Get the latest price of XAUT token or known as Gold',
  inputSchema: getXAUTPriceInputSchema,
  outputSchema: getXAUTPriceOutputSchema,
});
