defmodule Sketcher.LobbyPresence do
  use Phoenix.Presence, otp_app: :sketcher,
                        pubsub_server: Sketcher.PubSub
end
