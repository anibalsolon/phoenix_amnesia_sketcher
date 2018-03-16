defmodule Sketcher do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      supervisor(Sketcher.Endpoint, []),
      supervisor(Sketcher.LobbyPresence, []),
      supervisor(Sketcher.RoomPresence, [])
    ]

    opts = [strategy: :one_for_one, name: Sketcher.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    Sketcher.Endpoint.config_change(changed, removed)
    :ok
  end
end
