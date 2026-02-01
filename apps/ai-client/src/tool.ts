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

const getXAUTPriceDef = toolDefinition({
  name: 'get_XAUTPrice',
  description: 'Get the latest price of XAUT token or known as Gold',
  inputSchema: getXAUTPriceInputSchema,
  outputSchema: getXAUTPriceOutputSchema,
});

const fetchPriceInputSchema: JSONSchema = {
  type: "object",
  properties: {
    symbol: {
      type: "string",
      description: "the symbol of price being asked",
    },
  },
  required: ["symbol"]
};

const fetchPriceOutputSchema: JSONSchema = {
  type: "object",
  properties: {
    symbol: {
      type: "string",
      description: "the symbol of price being asked",
    },
    price: {
      type: "number",
      description: "the price of symbol being asked in USD",
    },
  },
  required: ["symbol", "price"],
};

const fetchPriceDef = toolDefinition({
  name: 'fetch_price',
  description: 'Get the latest price of something based on the symbol given by user',
  inputSchema: fetchPriceInputSchema,
  outputSchema: fetchPriceOutputSchema,
});

const getPriceDef = toolDefinition({
  name: 'get_price',
  description: 'Get the latest price of something based on the symbol given by user',
  inputSchema: fetchPriceInputSchema,
  outputSchema: fetchPriceOutputSchema,
});

const getCryptoPriceInputSchema: JSONSchema = {
  type: "object",
  properties: {
    symbol: {
      type: "string",
      description: "Cryptocurrency ticker symbol (e.g. BTC, ETH)",
    },
  },
  required: ["symbol"],
};

const getCryptoPriceOutputSchema: JSONSchema = {
  type: "object",
  properties: {
    symbol: {
      type: "string",
      // description: "the symbol of token price being asked",
    },
    price: {
      type: "number",
      // description: "the price of cryptocurrency token in USD"
    },
  },
  required: ["symbol", "price"],
};

const getCryptoPriceDef = toolDefinition({
  name: 'get_crypto_price',
  description: 'Use this tool whenever the user asks for the current or latest price of a cryptocurrency token in USD. Use "price" from the output schema and give it back to user. You MUST use this tool to answer price questions.',
  inputSchema: getCryptoPriceInputSchema,
  outputSchema: getCryptoPriceOutputSchema,
});

export {
  getXAUTPriceDef,
  fetchPriceDef,
  getPriceDef,
  getCryptoPriceDef,
};
