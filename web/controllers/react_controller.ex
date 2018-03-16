defmodule Sketcher.ReactController do
  use Sketcher.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
