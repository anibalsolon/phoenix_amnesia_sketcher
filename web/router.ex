defmodule Sketcher.Router do
  use Phoenix.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
  end

  scope "/*path", Sketcher do
    pipe_through :browser

    get "/", ReactController, :index
  end
end
