use Mix.Config

config :sketcher, Sketcher.Endpoint,
  http: [port: 4001],
  server: false

  config :logger, level: :warn
