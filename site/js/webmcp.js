/* WebMCP: two read-only tools over the public read API (/openapi.json). No-op without navigator.modelContext. */
(function () {
  "use strict";
  var mc = navigator.modelContext || document.modelContext;
  if (!mc) return;
  function call(url) {
    return fetch(url, { headers: { Accept: "application/json" } })
      .then(function (r) { return r.json(); })
      .catch(function (e) { return { error: { code: "network_error", message: String(e && e.message || e) } }; });
  }
  function text(r) { return { content: [{ type: "text", text: JSON.stringify(r) }], structuredContent: r }; }
  var tools = [
    {
      name: "searchListings",
      description: "Search live Soukbase listings by words, category, maximum price in USDC and delivery mode; returns items and next_cursor.",
      inputSchema: {
        type: "object",
        properties: {
          q: { type: "string", maxLength: 200, description: "Words to search in title, description and category." },
          category: { type: "string", enum: ["dataset", "prompt_set", "template", "report", "ebook_audio", "own_api_credits", "skill", "mcp_server", "workflow", "software", "creative_asset", "knowledge_base", "testing_qa", "business_intelligence", "localization", "education"] },
          price_max: { type: "string", pattern: "^\\d+\\.\\d{2}$", description: "Maximum price in USDC with two decimals, for example 5.00." },
          delivery_mode: { type: "string", enum: ["instant_text", "instant_links", "webhook", "hosted_file"] },
          seller: { type: "string", description: "Only listings of this seller handle." }
        },
        additionalProperties: false
      },
      annotations: { readOnlyHint: true },
      execute: function (a) {
        var p = new URLSearchParams(), k, keys = ["q", "category", "price_max", "delivery_mode", "seller"];
        a = a || {};
        for (var i = 0; i < keys.length; i++) { k = keys[i]; if (typeof a[k] === "string" && a[k] !== "") p.set(k, a[k]); }
        var s = p.toString();
        return call("/api/v1/listings" + (s ? "?" + s : "")).then(text);
      }
    },
    {
      name: "getListing",
      description: "Read one live Soukbase listing by its id or slug; returns the listing or the API error object; when the id is a seller handle, next_action says how to list that seller's listings.",
      inputSchema: {
        type: "object",
        properties: { id: { type: "string", minLength: 1, description: "Listing id or slug, as in /l/<slug>." } },
        required: ["id"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: true },
      execute: function (a) {
        var id = a && typeof a.id === "string" ? a.id : "";
        if (!id) return Promise.resolve(text({ error: { code: "invalid_request", message: "id is required" } }));
        return call("/api/v1/listings/" + encodeURIComponent(id)).then(text);
      }
    }
  ];
  try {
    if (mc === navigator.modelContext && typeof mc.registerTool === "function") tools.forEach(function (t) { navigator.modelContext.registerTool(t); });
    else if (typeof mc.registerTool === "function") tools.forEach(function (t) { mc.registerTool(t); });
    else if (typeof mc.provideContext === "function") mc.provideContext({ tools: tools });
  } catch (e) { /* a registration failure must not break the page */ }
})();
