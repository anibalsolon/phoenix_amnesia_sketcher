defmodule Sketcher.Web do
  def view do
    quote do
      use Phoenix.View, root: "web/templates"
      import Sketcher.Router.Helpers
      use Phoenix.HTML
    end
  end

  def controller do
    quote do
      use Phoenix.Controller
      import Sketcher.Router.Helpers
    end
  end

  def model do
    quote do
      # none
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
