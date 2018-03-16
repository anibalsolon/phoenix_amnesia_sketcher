defmodule Sketcher.UserSocket do
  use Phoenix.Socket

  channel "lobby", Sketcher.LobbyChannel
  channel "room:*", Sketcher.RoomChannel

  transport :websocket, Phoenix.Transports.WebSocket
  transport :longpoll, Phoenix.Transports.LongPoll

  def connect(%{"user" => user}, socket) do
    {:ok, assign(socket, :user, user) }
  end

  def id(_socket), do: nil
end
