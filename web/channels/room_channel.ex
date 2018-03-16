defmodule Sketcher.RoomChannel do
  use Phoenix.Channel
  use Amnesia
  use Database
  require Logger

  alias Sketcher.RoomPresence

  def join("room:" <> room_name, _message, socket) do
    Process.flag(:trap_exit, true)
    send(self(), {:after_join, room_name})
    {:ok, socket}
  end

  def handle_info({:after_join, room_name}, socket) do
    push socket, "presence_state", %{ state: RoomPresence.list(socket) }
    {:ok, _} = RoomPresence.track(socket, socket.assigns.user, %{
      joined_at: inspect(System.system_time(:seconds))
    })

    Amnesia.transaction do
      selection = Room.where(slug == room_name, limit: 1)
      room = Amnesia.Selection.values selection

      case room do
        [room] ->
          selection = Message.where room == room.id
          selection
            |> Amnesia.Selection.values
            |> (Enum.each &(push socket, "message/new", &1))

          selection = Drawing.where room == room.id
          selection
            |> Amnesia.Selection.values
            |> (Enum.each &(push socket, "path/new", &1))

          {:noreply, assign(socket, :room, room.id)}

        _ ->
          room = %Room{
            slug: room_name,
            locked: false
          }
          |> Room.write

          {:noreply, assign(socket, :room, room.id)}
      end
    end
  end

  def terminate(_reason, socket) do
    if map_size(RoomPresence.list(socket)) == 1 do
      Amnesia.transaction do
        Drawing.delete [room: socket.assigns.room]
        Message.delete [room: socket.assigns.room]
        Room.delete socket.assigns.room
      end
    end

    :ok
  end

  def handle_in("message/new", msg, socket) do
    broadcast! socket, "message/new", %{user: socket.assigns.user, content: msg["content"]}

    Amnesia.transaction do
      %Message{user: socket.assigns.user, content: msg["content"]} |> Message.write
    end

    {:reply, {:ok, %{}}, socket}
  end

  def handle_in("path/new", msg, socket) do
    time = System.system_time(:millisecond)

    broadcast! socket, "path/new", %{
      user: socket.assigns.user,
      time: time,
      identifier: msg["identifier"],
      path: msg["path"]
    }

    Amnesia.transaction do
      selection = Drawing.match [room: socket.assigns.room, identifier: msg["identifier"]]
      drawings = selection
                 |> Amnesia.Selection.values

      case drawings do

        [drawing] ->
          %Drawing{drawing | path: msg["path"]} |> Drawing.write()

        _ ->
          %Drawing{
            user: socket.assigns.user,
            room: socket.assigns.room,
            identifier: msg["identifier"],
            time: msg["time"],
            path: msg["path"]
          }
          |> Drawing.write

      end
    end

    {:reply, {:ok, %{}}, socket}
  end

  def handle_in("message/clear", _msg, socket) do
    Message.clear
    broadcast! socket, "message/clear", %{}
    {:reply, {:ok, %{}}, socket}
  end

  def handle_in("path/clear", _msg, socket) do
    Drawing.clear
    broadcast! socket, "path/clear", %{}
    {:reply, {:ok, %{}}, socket}
  end
end
