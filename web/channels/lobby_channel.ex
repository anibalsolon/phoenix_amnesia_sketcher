defmodule Sketcher.LobbyChannel do
  use Phoenix.Channel
  use Amnesia
  use Database
  require Logger

  alias Sketcher.LobbyPresence

  def join("lobby", message, socket) do
    Process.flag(:trap_exit, true)
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    push socket, "presence_state", %{ state: LobbyPresence.list(socket) }
    {:ok, _} = LobbyPresence.track(socket, socket.assigns.user, %{
      joined_at: inspect(System.system_time(:seconds))
    })
    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    :ok
  end
end
