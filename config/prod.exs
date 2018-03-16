use Mix.Config

config :sketcher, Sketcher.Endpoint,
  http: [port: {:system, "PORT"}],
  url: [host: {:system, "HOST"}]

config :logger, level: :info

import_config "prod.secret.exs"
