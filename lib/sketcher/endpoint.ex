defmodule Sketcher.Endpoint do
  use Phoenix.Endpoint, otp_app: :sketcher

  socket "/ws", Sketcher.UserSocket

  plug Plug.Static,
    at: "/", from: :sketcher,
    only: ~w(css images js favicon.ico robots.txt)

  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.CodeReloader
    plug Phoenix.LiveReloader
  end

  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Plug.Session,
    store: :cookie,
    key: "sketcher_key",
    signing_salt: "LH6XmqGb",
    encryption_salt: "CIPZg4Qo"

  plug Sketcher.Router
end
